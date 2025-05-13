import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesRejeteComponent } from './demandes-rejete.component';

describe('DemandesRejeteComponent', () => {
  let component: DemandesRejeteComponent;
  let fixture: ComponentFixture<DemandesRejeteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesRejeteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesRejeteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
