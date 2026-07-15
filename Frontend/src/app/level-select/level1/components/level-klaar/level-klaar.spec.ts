import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelKlaar } from './level-klaar';

describe('LevelKlaar', () => {
  let component: LevelKlaar;
  let fixture: ComponentFixture<LevelKlaar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelKlaar],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelKlaar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
