import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Instellingen } from './instellingen';

describe('Instellingen', () => {
  let component: Instellingen;
  let fixture: ComponentFixture<Instellingen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Instellingen],
    }).compileComponents();

    fixture = TestBed.createComponent(Instellingen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
