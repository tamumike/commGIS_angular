import { Injectable } from '@angular/core';
import { AlertifyService } from './alertify.service';
import { MapDataService } from './map-data.service';

@Injectable({
  providedIn: 'root'
})
export class ModalActionService {

constructor(public mapDataService: MapDataService, private alertifyService: AlertifyService) { }

modalAction(modalData: any) {
  switch (modalData.name) {

    case 'add-as-new':
      this.addFeatureLayer(modalData);
      break;
    case 'symbology':
      this.launchSymbology(modalData);
      break;
    case 'add-new-map-image':
      this.addMapImageLayer(modalData);
      break;
    default:
      break;
  }
}

private addFeatureLayer(modalData: any) {
  console.log('modal add feature layer');
  console.log(modalData);
  let renderer: any;
  let popupTemplate: any;

  const parentLayer = this.mapDataService.getLayerById(modalData.parentId);
  modalData.id = modalData.id.replace(' ', '-');

  if (parentLayer.type == 'map-image') {
    let parentMapImageLayer = this.mapDataService.getMapImageLayerById(modalData.parentId);
    parentMapImageLayer.sublayers.forEach(sublayer => {
      renderer = sublayer.renderer;
    });
    if (modalData.title){
      this.mapDataService.addMapImageLayerWithRendererToMap('feature', modalData.url, modalData.id, true, modalData.expression, modalData.title, popupTemplate, renderer);
    }

  } else if (parentLayer.type == 'feature') {
    let parentFeatureLayer = this.mapDataService.getFeatureLayerById(modalData.parentId);
    popupTemplate = parentFeatureLayer.popupTemplate;
    renderer =   this.mapDataService.generateRenderer(parentFeatureLayer);
    if (modalData.title){
      this.mapDataService.addLayerWithRendererToMap('feature', modalData.url, modalData.id, true, modalData.expression, modalData.title, popupTemplate, renderer);
    }
  }
  this.mapDataService.removeLayerFromMap(parentLayer);
}

private addMapImageLayer(modalData: any) {
  const parentLayer = this.mapDataService.getMapImageLayerById(modalData.parentId);
  // const popupTemplate = parentLayer.popupTemplate;
  // const renderer =   this.mapDataService.generateRenderer(parentLayer);

  this.mapDataService.removeLayerFromMap(parentLayer);
  modalData.id = modalData.id.replace(' ', '-');
  if (modalData.title){
    this.mapDataService.addMapImageLayerWithRendererToMap('feature', modalData.url, modalData.id, true, modalData.expression, modalData.title);
  }
}

private launchSymbology(modalData: any) {
  let layer = this.mapDataService.getFeatureLayerById(modalData.id);
  modalData.title = layer.title;

}

}
