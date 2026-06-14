import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Klassen } from './klassen';

describe('Klassen', () => {
  let component: Klassen;
  let fixture: ComponentFixture<Klassen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Klassen],
    }).compileComponents();

    fixture = TestBed.createComponent(Klassen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
