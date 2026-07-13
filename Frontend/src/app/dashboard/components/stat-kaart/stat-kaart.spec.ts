import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatKaart } from './stat-kaart';

describe('StatKaart', () => {
  let component: StatKaart;
  let fixture: ComponentFixture<StatKaart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatKaart],
    }).compileComponents();

    fixture = TestBed.createComponent(StatKaart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
