import { TestBed } from '@angular/core/testing';

import { ComplaintserviceService } from './complaintservice.service';

describe('ComplaintserviceService', () => {
  let service: ComplaintserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
