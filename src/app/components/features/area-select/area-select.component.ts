import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapDataService } from 'src/app/services/map-data.service';
import * as query from '@arcgis/core/rest/query';
import { areaSelectConfig } from './area-select.config';
import { Area } from '../../../data/models/area';
import { config } from '../../../config';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

@Component({
  selector: 'app-area-select',
  templateUrl: './area-select.component.html',
  styleUrls: ['./area-select.component.css']
})
export class AreaSelectComponent implements OnInit {
@ViewChild('areaSelect') areaSelect!: ElementRef;
public layer!: FeatureLayer;
public queryURL: string = areaSelectConfig.queryURL;
public areaOptions: Area[] = [];

  constructor(public mapDataService: MapDataService) { }

  ngOnInit() {
    // query the feature service to get the list of areas
    this.mapDataService.queryForAreas().subscribe(result => {
      let features = result.features;
      features.forEach((feature: any) => {
        let attributes = {NAME: feature.attributes.NAME, FAC_ID: feature.attributes.FAC_ID};
        this.areaOptions.push(attributes);
      });
    });

  }

  changeArea(): void {
    this.layer = this.mapDataService.getFeatureLayerById(areaSelectConfig.layerId);
    const selection = this.areaSelect.nativeElement.value.toUpperCase();

    let expression = `FAC_ID = '${selection}'`;
    if(selection != "DEFAULT") {
      this.mapDataService.changeLayerDefinitionExpression(areaSelectConfig.layerId, expression);
      let mapDataService = this.mapDataService;

      let feature;

      query.executeQueryJSON(this.queryURL, {
        where: expression,
        returnGeometry: true
      }).then(function(results) {
        feature = results.features[0];
        mapDataService.zoomMapToCentroidFromFeature(feature);
      }).then(function() {

        if (mapDataService.getFilterAllAssets()){

          mapDataService.emitAreaSelectEvent();

          config.systemLayers.forEach(layer => {
            let mapLayer = mapDataService.getFeatureLayerById(layer);

            mapDataService.removeLayerFromMap(mapDataService.getLayerById(layer));
            if (mapLayer) {
              console.log(`FAC_ID IN (${selection})`);
              mapDataService.addLayerWithRendererToMap('feature', mapLayer.url, mapLayer.id, mapLayer.visible,
                `FAC_ID IN (${selection})`, mapLayer.title, mapLayer.popupTemplate, mapLayer.renderer);
            }
          });
        } else {
          config.systemLayers.forEach(layer => {
            let mapLayer = mapDataService.getFeatureLayerById(layer);

            if (mapLayer) {
              mapDataService.changeLayerDefinitionExpression(mapLayer.id, '');
            }
          });
        }
      });

    }
  }

  toggleFilterAllAssets() {
    this.mapDataService.toggleFilterAllAssets();
    this.changeArea();
  }

}
