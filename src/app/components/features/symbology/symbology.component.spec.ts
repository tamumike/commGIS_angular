import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbologyComponent } from './symbology.component';

describe('SymbologyComponent', () => {
  let component: SymbologyComponent;
  let fixture: ComponentFixture<SymbologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbologyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymbologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
