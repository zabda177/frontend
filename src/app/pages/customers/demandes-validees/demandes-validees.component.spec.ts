import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesValideesComponent } from './demandes-validees.component';

describe('DemandesValideesComponent', () => {
  let component: DemandesValideesComponent;
  let fixture: ComponentFixture<DemandesValideesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesValideesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesValideesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
