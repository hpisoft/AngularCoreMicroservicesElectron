import { TestBed, inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ShapesService } from './shapes.service';
import { BackendEndpointsService } from './shared/backend-endpoints.service';

describe('ShapesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [ShapesService, BackendEndpointsService],
        imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([ShapesService], (service: ShapesService) => {
    expect(service).toBeTruthy();
  }));
});
