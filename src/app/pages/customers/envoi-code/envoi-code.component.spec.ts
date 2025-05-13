import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoiCodeComponent } from './envoi-code.component';

describe('EnvoiCodeComponent', () => {
  let component: EnvoiCodeComponent;
  let fixture: ComponentFixture<EnvoiCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvoiCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnvoiCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
