import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessieKaart } from './sessie-kaart';

describe('SessieKaart', () => {
  let component: SessieKaart;
  let fixture: ComponentFixture<SessieKaart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessieKaart],
    }).compileComponents();

    fixture = TestBed.createComponent(SessieKaart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
