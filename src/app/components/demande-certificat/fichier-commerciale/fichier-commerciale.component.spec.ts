import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierCommercialeComponent } from './fichier-commerciale.component';

describe('FichierCommercialeComponent', () => {
  let component: FichierCommercialeComponent;
  let fixture: ComponentFixture<FichierCommercialeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichierCommercialeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichierCommercialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
