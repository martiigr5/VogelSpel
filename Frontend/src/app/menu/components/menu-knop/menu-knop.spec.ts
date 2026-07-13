import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuKnop } from './menu-knop';

describe('MenuKnop', () => {
  let component: MenuKnop;
  let fixture: ComponentFixture<MenuKnop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuKnop],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuKnop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
