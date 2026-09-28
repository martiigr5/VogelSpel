import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoFront } from './logo-front';

describe('LogoFront', () => {
  let component: LogoFront;
  let fixture: ComponentFixture<LogoFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoFront],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoFront);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
