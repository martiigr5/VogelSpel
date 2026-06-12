import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Laden } from './laden';

describe('Laden', () => {
  let component: Laden;
  let fixture: ComponentFixture<Laden>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Laden],
    }).compileComponents();

    fixture = TestBed.createComponent(Laden);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
