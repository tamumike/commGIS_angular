import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { MapDataService } from 'src/app/services/map-data.service';
import { SimpleMarkerSymbolProps } from 'src/app/data/simpleMarkerSymbolProps';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel.service';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import esriRequest from "@arcgis/core/request";
import { QueryService } from 'src/app/services/query.service';

@Component({
  selector: 'app-symbology',
  templateUrl: './symbology.component.html',
  styleUrls: ['./symbology.component.css']
})
export class SymbologyComponent implements OnInit {
  @Input() layerId!: string;
  public layer!: FeatureLayer | MapImageLayer;
  public geometryType!: string;
  public polygonProps : {fill: string, outline: {color: string, width: string}} = {fill: '', outline: {color: '', width: ''}};
  public pointProps : {color: string, size: number, style: string, outline: {color: string}} = {color: '', size: 0, style: "color", outline: {color: ''}};
  public polylineProps: {color: string, width: number, style: string} = {color: '', width: 0, style: 'solid'};
  public pointOptions: string[] = ['circle', 'cross', 'diamond', 'square', 'triangle', 'x'];
  public polylineOptions: string[] = ['solid', 'dash', 'dot'];
  public markerStyle!: string;
  public width!: string;
  public opacity!: string;
  public dimensionLabel!: string;
  public simpleRenderer: boolean = false;
  layerRenderer!: any;


  constructor(private mapDataService: MapDataService, public route: ActivatedRoute, public router: Router, public panelService: PanelService, private queryService: QueryService ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      let layer = this.mapDataService.getLayerById(data['data']);
      if (layer.type == 'feature') {
        this.layer = this.mapDataService.getFeatureLayerById(data['data']);
        this.layerRenderer = this.layer.renderer;
        this.geometryType = this.layer.geometryType;
        this.simpleRenderer = this.layer.renderer && this.layer.renderer.type == 'simple';
        this.processSymbol();
      } else if (layer.type == 'map-image') {

        this.layer = this.mapDataService.getMapImageLayerById(data['data']);
        let activeRenderer: boolean = false;

        this.layer.sublayers.forEach((sublayer: any) => {
          if (sublayer.renderer) {

            this.layerRenderer = sublayer.renderer;
            this.simpleRenderer = sublayer.renderer.type == 'simple';
            activeRenderer = true;

          }
        });
        this.queryService.requestInfo(this.layer).then(response => {
          this.geometryType = this.convertGeometryType(response.data.geometryType);
          if (!activeRenderer) {
            this.layerRenderer = this.generateMapImageRenderer(response.data.drawingInfo.renderer);
            this.simpleRenderer = this.layerRenderer.type;
          }
          this.processSymbol();
        });

      }
    });
  }

  processSymbol() {

    if (this.simpleRenderer) {
      switch (this.geometryType) {
        case 'polyline':
          this.dimensionLabel = 'Width';
          this.processPolylineSymbol();
          break;
        case 'polygon':
          this.dimensionLabel = 'Outline Width';
          this.processPolygonSymbol();
          break;
        case 'point':
          this.dimensionLabel = 'Size';
          this.processPointSymbol();
          break;

        default:
          break;
      }
    } else {
      let layerOpacity = this.layer.opacity;
      this.opacity = (layerOpacity*100).toString();
      this.dimensionLabel = 'Opacity';
    }

  }

  generateMapImageRenderer(info: any): any {

    let renderer: any;
    if (this.geometryType == 'polyline') {
      renderer = new SimpleRenderer({
        symbol: new SimpleLineSymbol({
          color: this.deconstructMapImageColorInfo(info.symbol.color),
          style: 'solid',
          width: info.symbol.width
        })
      });
    } else if (this.geometryType == 'point') {
      renderer = new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
          color: this.deconstructMapImageColorInfo(info.symbol.color),
          style: info.symbol.style.replace('esriSMS', '').toLowerCase() as any,
          size: info.symbol.size,
          outline: new SimpleLineSymbol({
            color: this.deconstructMapImageColorInfo(info.symbol.outline.color)
          })
        })
      });
    } else if (this.geometryType == 'polygon') {
      renderer = new SimpleRenderer({
        symbol: new SimpleFillSymbol({
          color: this.deconstructMapImageColorInfo(info.symbol.color),
          style: 'solid',
          outline: new SimpleLineSymbol({
            color: this.deconstructMapImageColorInfo(info.symbol.outline.color),
            width: info.symbol.outline.width,
            style: info.symbol.outline.style.replace('esriSLS', '').toLowerCase()
          })
        })
      });
    }
    return renderer;
  }

  getRenderer(): any {
    return this.layerRenderer;
  }

  convertGeometryType(geometryType: string): string {
    let converter: string = '';
    if (geometryType == 'esriGeometryPolyline') {
      converter = 'polyline';
    } else if (geometryType == 'esriGeometryPolygon') {
      converter = 'polygon';
    } else if (geometryType == 'esriGeometryPoint') {
      converter = 'point';
    }

    return converter;
  }

  processPointSymbol(): void {
    let rendererClone = this.layerRenderer.clone();
    this.pointProps.color = this.deconstructColorInfo(rendererClone.symbol);
    this.pointProps.outline.color = this.deconstructColorInfo(rendererClone.symbol.outline);
    this.pointProps.style = rendererClone.symbol.style;
    this.width = rendererClone.symbol.size;
  }

  processPolygonSymbol(): void {
    let rendererClone = this.layerRenderer.clone();
    this.polygonProps.fill = this.deconstructColorInfo(rendererClone.symbol);
    this.polygonProps.outline.color = this.deconstructColorInfo(rendererClone.symbol.outline);
    this.width = rendererClone.symbol.outline.width;
  }

  processPolylineSymbol(): void {
    let rendererClone = this.layerRenderer.clone();
    this.polylineProps.color = this.deconstructColorInfo(rendererClone.symbol);
    this.polylineProps.style = rendererClone.symbol.style;
    this.width = rendererClone.symbol.width;
  }

  deconstructColorInfo(info: any) {

    let {r,g,b,a} = info.color;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  deconstructMapImageColorInfo(info: any) {

    return `rgba(${info[0]}, ${info[1]}, ${info[2]}, ${info[3]})`;
  }

  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  public colorPickerSelect(value: any) {
    console.log(value);
  }

  public setObjectProperty(value: string, property: string) {
    let propObject = this.readObj(this.polygonProps, property);
    propObject = value;
  }

  private readObj(obj: any, prop: string) {
    return obj[prop];
  }

  actionFunction(type: string) {
    if (this.simpleRenderer) {
      switch (type) {
        case 'polygon':
          this.applyPolygonSymbol();
          break;
        case 'point':
          this.applyPointSymbol();
          break;
        case 'polyline':
          this.applyPolylineSymbol();
          break;
      }
    }
    else {
      this.applyOpacityChange();
    }

  }

  applyOpacityChange() {
    this.layer.opacity = parseInt(this.opacity) * 0.01;
    this.goBack();

  }

  applyPolylineSymbol() {
    const renderer = new SimpleRenderer({
      symbol: new SimpleLineSymbol({
        color: this.polylineProps.color,
        style: this.polylineProps.style as any,
        width: this.width
      })
    });

    this.setRenderer(this.layer, renderer);
    this.goBack();
  }

  applyPointSymbol() {

    const renderer = new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        color: this.pointProps.color,
        style: this.pointProps.style as any,
        size: this.width,
        outline: new SimpleLineSymbol({
          color: this.pointProps.outline.color
        })
      })
    });
    // this.layer.renderer = renderer;
    this.setRenderer(this.layer, renderer);
    this.goBack();
  }

  applyPolygonSymbol() {
    // mak polygon function
    const renderer = new SimpleRenderer({
      symbol: new SimpleFillSymbol({
        color: this.polygonProps.fill,
        style: 'solid',
        outline: new SimpleLineSymbol({
          color: this.polygonProps.outline.color,
          width: this.width
        })
      })
    });

    // this.layer.renderer = renderer;
    this.setRenderer(this.layer, renderer);
    this.goBack();
  }

  setRenderer(layer: FeatureLayer| MapImageLayer, renderer: any) {
    if (this.layer.type == 'feature') {
      this.layer.renderer = renderer;
    } else if (this.layer.type == 'map-image'){
      this.layer.sublayers.forEach(sublayer => {
        sublayer.set('renderer', renderer);
      })
    }
  }

  goBack(): void {
    this.panelService.setActiveWidget('Layers');
    this.router.navigate(['Layers']);
  }



}
