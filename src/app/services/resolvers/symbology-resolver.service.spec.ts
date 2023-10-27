/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SymbologyResolverService } from './symbology-resolver.service';

describe('Service: SymbologyResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SymbologyResolverService]
    });
  });

  it('should ...', inject([SymbologyResolverService], (service: SymbologyResolverService) => {
    expect(service).toBeTruthy();
  }));
});
