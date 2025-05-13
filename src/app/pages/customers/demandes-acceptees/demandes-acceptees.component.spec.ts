import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesAccepteesComponent } from './demandes-acceptees.component';

describe('DemandesAccepteesComponent', () => {
  let component: DemandesAccepteesComponent;
  let fixture: ComponentFixture<DemandesAccepteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesAccepteesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesAccepteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
