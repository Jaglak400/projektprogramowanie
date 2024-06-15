import { TestBed } from '@angular/core/testing';

import { SerwisService } from './serwis.service';

describe('SerwisService', () => {
  let service: SerwisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerwisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
