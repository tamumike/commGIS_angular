import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreageComponent } from './acreage.component';

describe('AcreageComponent', () => {
  let component: AcreageComponent;
  let fixture: ComponentFixture<AcreageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcreageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcreageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
