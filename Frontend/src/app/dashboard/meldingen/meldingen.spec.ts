import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Meldingen } from './meldingen';

describe('Meldingen', () => {
  let component: Meldingen;
  let fixture: ComponentFixture<Meldingen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Meldingen],
    }).compileComponents();

    fixture = TestBed.createComponent(Meldingen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
