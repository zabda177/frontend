import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichierGuideComponent } from './fichier-guide.component';

describe('FichierGuideComponent', () => {
  let component: FichierGuideComponent;
  let fixture: ComponentFixture<FichierGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichierGuideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FichierGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
