import { TestBed } from '@angular/core/testing';

import { FabricacionService } from './fabricacion.service';

describe('FabricacionService', () => {
  let service: FabricacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FabricacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
