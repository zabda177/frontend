import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeSoumiseComponent } from './demande-soumise.component';

describe('DemandeSoumiseComponent', () => {
  let component: DemandeSoumiseComponent;
  let fixture: ComponentFixture<DemandeSoumiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeSoumiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandeSoumiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
