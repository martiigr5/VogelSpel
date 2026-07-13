import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelKaart } from './level-kaart';

describe('LevelKaart', () => {
  let component: LevelKaart;
  let fixture: ComponentFixture<LevelKaart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelKaart],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelKaart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
