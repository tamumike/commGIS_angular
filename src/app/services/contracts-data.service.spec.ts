/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContractsDataService } from './contracts-data.service';

describe('Service: ContractsData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractsDataService]
    });
  });

  it('should ...', inject([ContractsDataService], (service: ContractsDataService) => {
    expect(service).toBeTruthy();
  }));
});
