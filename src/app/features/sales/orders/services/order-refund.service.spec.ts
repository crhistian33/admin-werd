import { TestBed } from '@angular/core/testing';

import { OrderRefundService } from './order-refund.service';

describe('OrderRefundService', () => {
  let service: OrderRefundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderRefundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
