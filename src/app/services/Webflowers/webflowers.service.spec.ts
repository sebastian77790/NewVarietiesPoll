import { TestBed } from '@angular/core/testing';

import { WebflowersService } from './webflowers.service';

describe('WebflowersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebflowersService = TestBed.get(WebflowersService);
    expect(service).toBeTruthy();
  });
});
