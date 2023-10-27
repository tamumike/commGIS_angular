import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Collection from '@arcgis/core/core/Collection';
import Layer from '@arcgis/core/layers/layer';
import { MapDataService } from 'src/app/services/map-data.service';
import { PanelService } from 'src/app/services/panel.service';
import { ModalComponent } from '../../ui/modal/modal.component';
import { SymbologyComponent } from '../symbology/symbology.component';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent implements OnInit {
  public mapLayers!: Collection<Layer>;
  public layer!: Layer;
  @ViewChild('LayerList') LayerListEl!: ElementRef;

  constructor(public mapDataService: MapDataService, public matDialog: MatDialog, public router: Router, public panelService: PanelService) { }

  ngOnInit() {
    this.getLayers();
  }

  getLayers(): void {
    this.mapLayers = this.mapDataService.getMapLayers().filter((layer: Layer) => {
       return layer.type == 'feature' || layer.type == 'map-image';
    }).reverse();
  }

  getLayer(id: string): void {
    this.layer = this.mapDataService.getMapImageLayerById('layer-acreage');
    console.log(this.layer);
  }

  toggleLayerVisibility(id: string): void {
    let layer = this.mapDataService.getLayerById(id);
    layer.visible = !layer.visible;
  }

  checkIfRemovable(title: string): boolean {
    const exceptionLayers: string[] = ['Asset Areas', 'STR']
    return title.indexOf('Targa') != -1 || exceptionLayers.includes(title);
  }

  removeLayer(id: string): void {

    for (let layer of this.mapLayers) {
      if (layer.id == id) {
        this.mapDataService.removeLayerFromMap(layer);
        this.mapLayers.remove(layer);
      }
    }

  }

  launchSymbology(id: string, title: string): void {
    this.router.navigate(['Symbology/' + id]);
    this.panelService.setActiveWidget('Symbology');
  }

}
