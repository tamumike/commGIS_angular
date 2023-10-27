import { Injectable } from '@angular/core';
import * as query from '@arcgis/core/rest/query';
import { from, Observable } from 'rxjs';
import { acreageConfig } from '../components/features/acreage/acreage.config';

@Injectable({
  providedIn: 'root'
})
export class ContractsDataService {
  public fields: string[] = [];

constructor() { }


queryForContractsFields(): Observable<any> {
  let fieldsArray = this.fields;
  return from(query.executeQueryJSON(acreageConfig.queryURL, {
    where: `CONTRACT <> '$$$'`,
    outFields: ['*'],
    num: 1,
    returnGeometry: true
  }));
}

}
