import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierConcessionComponent } from './fichier-concession.component';

describe('FichierConcessionComponent', () => {
  let component: FichierConcessionComponent;
  let fixture: ComponentFixture<FichierConcessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichierConcessionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichierConcessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
