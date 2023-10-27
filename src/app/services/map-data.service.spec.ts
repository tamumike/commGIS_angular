/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapDataService } from './map-data.service';

describe('Service: MapData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapDataService]
    });
  });

  it('should ...', inject([MapDataService], (service: MapDataService) => {
    expect(service).toBeTruthy();
  }));
});
