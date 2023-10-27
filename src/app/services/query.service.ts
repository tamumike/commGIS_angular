import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import * as query from '@arcgis/core/rest/query';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import esriRequest from "@arcgis/core/request";
import Layer from '@arcgis/core/layers/Layer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  public fields: string[] = [];

constructor() { }

queryForFields(url: string, where: string): Observable<any> {
  return from(query.executeQueryJSON(url, {
    where,
    outFields: ['*'],
    num: 1,
    returnGeometry: false
  }));
}

requestInfo(layer: MapImageLayer | FeatureLayer): IPromise<any> {

  let request = esriRequest(`${layer.url}/0`, {
      query: {
          f: "json"
      },
      responseType: "json"
  });

  return request;

}

}
