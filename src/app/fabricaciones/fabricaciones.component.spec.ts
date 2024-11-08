import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricacionesComponent } from './fabricaciones.component';

describe('FabricacionesComponent', () => {
  let component: FabricacionesComponent;
  let fixture: ComponentFixture<FabricacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FabricacionesComponent]
    });
    fixture = TestBed.createComponent(FabricacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
