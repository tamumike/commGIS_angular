import { Injectable } from '@angular/core';
import * as query from '@arcgis/core/rest/query';
import { format } from 'path';
import { from, Observable } from 'rxjs';
import { thirdPartyConfig } from '../components/features/third-party/third-party.config';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyService {
  public producers: string[] = [];

constructor() { }

queryForProducers(): Observable<any> {
  let producersArray = this.producers;
  return from(query.executeQueryJSON(thirdPartyConfig.queryURL, {
    where: "STATUS <> '$$$'",
    outFields: ['*'],
    returnGeometry: false
  }));
}

}
