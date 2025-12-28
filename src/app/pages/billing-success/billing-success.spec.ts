import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSuccess } from './billing-success';

describe('BillingSuccess', () => {
  let component: BillingSuccess;
  let fixture: ComponentFixture<BillingSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
