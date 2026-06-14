import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leerlingen } from './leerlingen';

describe('Leerlingen', () => {
  let component: Leerlingen;
  let fixture: ComponentFixture<Leerlingen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leerlingen],
    }).compileComponents();

    fixture = TestBed.createComponent(Leerlingen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
