import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlankBanner } from './klank-banner';

describe('KlankBanner', () => {
  let component: KlankBanner;
  let fixture: ComponentFixture<KlankBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlankBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(KlankBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
