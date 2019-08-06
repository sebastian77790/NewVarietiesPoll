import { TestBed } from '@angular/core/testing';

import { AccessInterceptorService } from './access-interceptor.service';

describe('AccessInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccessInterceptorService = TestBed.get(AccessInterceptorService);
    expect(service).toBeTruthy();
  });
});
