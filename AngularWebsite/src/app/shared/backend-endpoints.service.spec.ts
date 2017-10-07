import { TestBed, inject } from '@angular/core/testing';

import { BackendEndpointsService } from './backend-endpoints.service';

describe('BackendEndpointsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendEndpointsService]
    });
  });

  it('should be created', inject([BackendEndpointsService], (service: BackendEndpointsService) => {
    expect(service).toBeTruthy();
  }));
});
