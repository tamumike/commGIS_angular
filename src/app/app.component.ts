import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';

import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Expand from '@arcgis/core/widgets/Expand';
import BaseMapGallery from '@arcgis/core/widgets/BasemapGallery';
import Legend from '@arcgis/core/widgets/Legend';
import { MapDataService } from './services/map-data.service';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Compass from '@arcgis/core/widgets/Compass';
import Sketch from '@arcgis/core/widgets/Sketch';
import Search from '@arcgis/core/widgets/Search';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { systemLayers } from './config';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import { environment } from 'src/environments/environment';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
import Print from '@arcgis/core/widgets/Print';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public view: any = null;

  constructor(public mapDataService: MapDataService) {}

  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  initializeMap(): Promise<any> {

    const info = new OAuthInfo({
      appId: environment.appId,
      portalUrl: environment.portalUrl,
      flowType: 'authorization-code',
      popup: false
    });
    const esriId = IdentityManager;
    esriId.registerOAuthInfos([info]);
    esriId.getCredential(environment.portalUrl + "/sharing");
    esriId.checkSignInStatus(environment.portalUrl + "/sharing").then(
    function() {
      console.log('check sign in');
      // appController()
    }).finally(
      function() {
        console.log('finally');
      }
    );

    const container = this.mapViewEl.nativeElement;

    // grab all of the default system layers from config.ts
    // create feature layers with properties
    // add to an array and deconstruct array into the webmap constructor
    const systemLayerArray: FeatureLayer[] = [];
    const searchSources: any = [];

    systemLayers.forEach(systemLayer => {
      let layer = new FeatureLayer({
        id: systemLayer.id,
        title: systemLayer.title,
        url: systemLayer.url,
        visible: systemLayer.visible,
        // sublayers: systemLayer.sublayers
        popupEnabled: systemLayer.popupEnabled,
        popupTemplate: systemLayer.popupTemplate
      });

      // if renderer has been defined in the config, set renderer
      if (systemLayer.renderer) layer.renderer = systemLayer.renderer;

      // if search has been defined in config, set search source for Search widget
      if (systemLayer.searchConfig) {
        let searchConfig = systemLayer.searchConfig;
        searchSources.push({
          layer: layer,
          searchFields: searchConfig.searchFields,
          displayField: searchConfig.displayField,
          exactMatch: searchConfig.exactMatch,
          outFields: searchConfig.outFields,
          name: searchConfig.name,
          placeholder: searchConfig.placeholder
        });
      }

      systemLayerArray.push(layer);
    });

    let str = new MapImageLayer({
      url: environment.baseUrl + 'Boundaries/SectionTownshipRange/MapServer',
      id: 'str',
      title: 'STR',
      sublayers: [{
        id: 3,
        visible: true
      }, {
        id: 2,
        visible: true
      }, {
        id: 1,
        visible: true
      }, {
        id: 0,
        visible: true
      }],
      visible: false
    });

    // create a graphics layer for the Sketch widget
    let graphicsLayer = new GraphicsLayer();

    const webmap = new WebMap({
      basemap: "streets-vector",
      layers: [str, ...systemLayerArray, graphicsLayer]
    });


    const view = new MapView({
      container,
      map: webmap,
      zoom: 9,
      center: [-95.366564,  29.759394],
      ui: {
        components: []
      }
    });

    const legend = new Legend({
      view
    });

    const legendExpand = new Expand({
      view,
      content: legend,
      expanded: false,
      collapseTooltip: 'Legend',
      expandTooltip: 'Legend'
    });

    const basemapGallery = new BaseMapGallery({
      view
    });

    const print = new Print({
      view,
      printServiceUrl: environment.baseUrl + "MapServices/PrintGeoprocessingService2/GPServer/Export%20Web%20Map"
    });

    const printExpand = new Expand({
      view,
      content: print,
      collapseTooltip: 'Print',
      expandTooltip: 'Print'
    });

    const basemapExpand = new Expand({
      view,
      content: basemapGallery,
      expanded: false,
      collapseTooltip: 'Basemap Gallery',
      expandTooltip: 'Basemap Gallery'
    });

    const scalebar = new ScaleBar({
      view,
      style: "ruler"
    });
    const compass = new Compass({
      view
    });

    let sketch = new Sketch({layer: graphicsLayer, view, creationMode: 'update'});
    const sketchExpand = new Expand({
      view,
      content: sketch,
      expanded: false,
      collapseTooltip: 'Sketch',
      expandTooltip: 'Sketch'
    });

    const search = new Search({
      view,
      sources: searchSources,
      includeDefaultSources: false
    });
    const searchExpand = new Expand({
      view,
      content: search,
      expanded: false,
      collapseTooltip: 'Search',
      expandTooltip: 'Search'
    });

    view.ui.add(compass, { position: "top-right"} );
    view.ui.add(legendExpand, { position: 'top-right' } );
    view.ui.add(basemapExpand, { position: 'top-right' } );
    view.ui.add(scalebar, { position: "bottom-left"} );
    view.ui.add(sketchExpand, { position: 'top-right'});
    view.ui.add(searchExpand, { position: 'top-right' });
    view.ui.add(printExpand, { position : 'top-right' });

    webmap.when(() => {
      // REMOVED DEFAULT CODE
      this.mapDataService.setWebMap(webmap);
      this.mapDataService.setView(view);
    });

    this.view = view;
    return this.view.when();
  }

  ngOnInit(): any {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(() => {
      // The map has been initialized
        console.log('The map is ready.');
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
