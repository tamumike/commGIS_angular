/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ThirdPartyService } from './third-party.service';

describe('Service: ThirdParty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThirdPartyService]
    });
  });

  it('should ...', inject([ThirdPartyService], (service: ThirdPartyService) => {
    expect(service).toBeTruthy();
  }));
});
