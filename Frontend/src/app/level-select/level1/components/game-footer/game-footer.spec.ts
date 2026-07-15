import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFooter } from './game-footer';

describe('GameFooter', () => {
  let component: GameFooter;
  let fixture: ComponentFixture<GameFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(GameFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
