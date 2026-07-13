import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeerlingRij } from './leerling-rij';

describe('LeerlingRij', () => {
  let component: LeerlingRij;
  let fixture: ComponentFixture<LeerlingRij>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeerlingRij],
    }).compileComponents();

    fixture = TestBed.createComponent(LeerlingRij);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
