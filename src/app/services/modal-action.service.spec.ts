/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModalActionService } from './modal-action.service';

describe('Service: ModalAction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalActionService]
    });
  });

  it('should ...', inject([ModalActionService], (service: ModalActionService) => {
    expect(service).toBeTruthy();
  }));
});
