import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoortgangBalk } from './voortgang-balk';

describe('VoortgangBalk', () => {
  let component: VoortgangBalk;
  let fixture: ComponentFixture<VoortgangBalk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoortgangBalk],
    }).compileComponents();

    fixture = TestBed.createComponent(VoortgangBalk);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
