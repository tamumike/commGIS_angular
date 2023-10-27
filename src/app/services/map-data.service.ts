import { EventEmitter, Injectable } from '@angular/core';
import WebMap from '@arcgis/core/WebMap';
import Collection from '@arcgis/core/core/Collection';
import Layer from '@arcgis/core/layers/Layer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import MapView from '@arcgis/core/views/MapView';
import * as query from '@arcgis/core/rest/query';
import { areaSelectConfig } from '../components/features/area-select/area-select.config';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleFillSymbol from'@arcgis/core/symbols/SimpleFillSymbol';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { AlertifyService } from './alertify.service';
import { QueryService } from './query.service';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {
  public webmap!: WebMap;
  public view!: MapView;
  public selectedArea!: string;
  public areas: any[] = [];
  public filterAllAssets: boolean = false;
  public areaSelectEvent: EventEmitter<boolean> = new EventEmitter();

constructor(private http: HttpClient, private alertifyService: AlertifyService, private queryService: QueryService) { }

setWebMap(webmap: WebMap) {
  this.webmap = webmap;
}

getWebMap(): WebMap {
  return this.webmap;
}

setView(view: MapView) {
  this.view = view;
}

getView(): MapView {
  return this.view;
}

getMapLayers(): Collection<Layer> {
  return this.webmap.allLayers;
}

getLayerById(id: string): Layer {
  return this.webmap.findLayerById(id);
}

getMapImageLayerById(id: string): MapImageLayer {
  return this.webmap.findLayerById(id) as MapImageLayer;
}

getFeatureLayerById(id: string): FeatureLayer {
  return this.webmap.findLayerById(id) as FeatureLayer;
}

addMapImageLayerToMap(layer: MapImageLayer): void {
  this.webmap.add(layer);
  layer.when(() => {
    this.alertifyService.success(layer.title + ' has been added!');
  }, (error: any) => {
    this.alertifyService.error('Something went wrong...');
  });
}

addFeatureLayerToMap(layer: FeatureLayer): void {
  this.webmap.add(layer);
  layer.when(() => {
    this.alertifyService.success(layer.title + ' has been added!');
  }, (error: any) => {
    this.alertifyService.error('Something went wrong...');
  });
}

addFeatureLayersToMap(layers: Layer[]): void {
  layers.forEach(layer => {
    this.webmap.add(layer);
    layer.when(() => {
      this.alertifyService.success(layer.title + ' has been added!');
    }, (error: any) => {
      this.alertifyService.error('Something went wrong...');
    });
  });
}

addLayerToMap(type: string, url: string, id: string, visible: boolean = true, definitionExpression?: string, title?: string, popupTemplate?:any): FeatureLayer | MapImageLayer {

  let layer: Layer = new Layer();

  if (type == 'feature') {
    layer = new FeatureLayer({url, id, visible, definitionExpression, title, popupTemplate});
  } else if (type == 'map-image') {
    layer = new MapImageLayer({url, id, visible, title, sublayers:[{id: 0, popupTemplate, definitionExpression}]})
  }

  this.webmap.add(layer as Layer);
  layer.when(() => {
    this.alertifyService.success(layer.title + ' has been added!');
    this.reorderMapLayer(layer as FeatureLayer);
  }, (error: any) => {
    this.alertifyService.error('Something went wrong...');
  });

  return layer as FeatureLayer;

}

addLayerWithRendererToMap(type: string, url: string, id: string, visible: boolean = true, definitionExpression?: string, title?: string, popupTemplate?:any, renderer?: any ): Layer {

  let layer: FeatureLayer;

  layer = new FeatureLayer({url, id, visible, definitionExpression, title, popupTemplate, renderer});

  this.webmap.add(layer as Layer);
  console.log(layer);
  layer.when(() => {
    this.alertifyService.success(layer.title + ' has been added!');
    this.reorderMapLayer(layer);
  }, (error: any) => {
    this.alertifyService.error('Something went wrong...');
  });

  return layer;

}

addMapImageLayerWithRendererToMap(type: string, url: string, id: string, visible: boolean = true, definitionExpression?: string, title?: string, popupTemplate?:any, renderer?: any ): MapImageLayer {
  let layer: MapImageLayer;
  layer = new MapImageLayer({url, id, visible, title, sublayers:[{id: 0, popupTemplate, renderer, definitionExpression}] });
  this.webmap.add(layer);
  layer.when(() => {
    this.alertifyService.success(layer.title + ' has been added!');
    this.reorderMapLayer(layer);
  }, (error: any) => {
    this.alertifyService.error('Something went wrong...');
  });
  return layer;
}

reorderMapLayer(layer: FeatureLayer | MapImageLayer): void {
  // if polygon, find first instance of polyline subtract one from index
  // if polyline, find first instance of point subtract one from index
  // if point, reorder to top of list

  let layerTypesList: string[] = [];
  let layerType: string = '';
  let layerIndex: number = 0;

  let layers = this.getMapLayers().filter(x => {
    return x.type == 'feature' || x.type == 'map-image';
  });

  layers.forEach((layer: any) => {
    this.queryService.requestInfo(layer).then(response => {
      let geometryType = response.data.geometryType;
      layerTypesList.push(geometryType.replace('esriGeometry', '').toLowerCase());
    });
  });

  this.queryService.requestInfo(layer).then(response => {
    layerType = response.data.geometryType.replace('esriGeometry', '').toLowerCase();
    if (layerType == 'polygon') {
      layerIndex = layerTypesList.indexOf('polyline') - 1; // add one to account for STR
    } else if (layerType == 'polyline') {
      layerIndex = layerTypesList.indexOf('point'); // add one to account for STR
    } else {
      layerIndex = layerTypesList.length;
    }
    this.webmap.reorder(layer, layerIndex);
  });
}

removeLayerFromMap(layer: Layer): void {
    this.webmap.remove(layer);
}

getExportMap(url: string): Observable<any> {
  let product;
  return this.http.get(url, { observe: 'response' })
  .pipe(
    map(response => {
      product = response.body;
      return product;
    })
  );
}

zoomMapToCentroidFromFeature(feature: any): void {
  let centroid = feature.geometry.centroid;
  let coords = [centroid.longitude, centroid.latitude];
  this.view.goTo({
    target: coords,
    zoom: 8
  }, {duration: 3000});
}

changeLayerDefinitionExpression(id: string, expression: string): void {
  let layer = this.getFeatureLayerById(id);
  // let sublayer = layer.findSublayerById(0);
  layer.definitionExpression = expression;
}

changeMapImageLayerDefinitionExpression(id: string, expression: string): void {
  let layer: MapImageLayer = this.getMapImageLayerById(id);
  layer.sublayers.forEach(sublayer => {
    sublayer.definitionExpression = expression;
  });
}

queryForAreas(): Observable<any> {
  let areasArray = this.areas;
  return from(query.executeQueryJSON(areaSelectConfig.queryURL, {
    where: `NAME <> '$$$'`,
    outFields: ['*'],
    orderByFields: ['NAME'],
    returnGeometry: true
  }));
}

setAreas(data: any[]) {
  this.areas = data;
}

getAreas(): any[] {
  return this.areas;
}

setSelectedArea(area: string): void {
  this.selectedArea = area;
}

getSelectedArea(): string {
  return this.selectedArea;
}

toggleFilterAllAssets() {
  this.filterAllAssets = !this.filterAllAssets;
  console.log(this.filterAllAssets);
}

getFilterAllAssets() {
  return this.filterAllAssets;
}

emitAreaSelectEvent(): void {
  this.areaSelectEvent.emit(true);
}

getEmitAreaSelectEvent(): Observable<boolean> {
  return this.areaSelectEvent.asObservable();
}

generateRenderer(layer: FeatureLayer): SimpleRenderer{
  const geometryType = layer.geometryType;
  const colors: string[] = ['#F47D1A', '#E4E0AA', '#B40078', '#385723', '#0079A4', '#FF8B8B']

  let renderer: SimpleRenderer;
  if (geometryType == 'polygon') {
    renderer = new SimpleRenderer({
      symbol: new SimpleFillSymbol({
        color: colors[Math.floor(Math.random() * colors.length)],
        style: 'solid',
        outline: new SimpleLineSymbol({
          color: '#B2B2B2',
          width: 0.7
        })
      })
    });
  } else if (geometryType == 'polyline') {
    renderer = new SimpleRenderer({
      symbol: new SimpleLineSymbol({
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 1
      })
    });
  } else {
    renderer = new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        color: colors[Math.floor(Math.random() * colors.length)],
        size: '8px',
        style: 'circle',
        outline: {
          color: 'black',
          width: 1
        }
      })
    });
  }

  return renderer;
}



}
