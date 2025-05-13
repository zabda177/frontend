import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierPermisComponent } from './fichier-permis.component';

describe('FichierPermisComponent', () => {
  let component: FichierPermisComponent;
  let fixture: ComponentFixture<FichierPermisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichierPermisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichierPermisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
