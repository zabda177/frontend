import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationDemandeComponent } from './situation-demande.component';

describe('SituationDemandeComponent', () => {
  let component: SituationDemandeComponent;
  let fixture: ComponentFixture<SituationDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SituationDemandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SituationDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
