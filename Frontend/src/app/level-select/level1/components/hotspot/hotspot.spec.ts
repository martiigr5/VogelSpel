import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hotspot } from './hotspot';

describe('Hotspot', () => {
  let component: Hotspot;
  let fixture: ComponentFixture<Hotspot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hotspot],
    }).compileComponents();

    fixture = TestBed.createComponent(Hotspot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
