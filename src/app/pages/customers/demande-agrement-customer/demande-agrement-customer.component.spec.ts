import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeAgrementCustomerComponent } from './demande-agrement-customer.component';

describe('DemandeAgrementCustomerComponent', () => {
  let component: DemandeAgrementCustomerComponent;
  let fixture: ComponentFixture<DemandeAgrementCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeAgrementCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandeAgrementCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
