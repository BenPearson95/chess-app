import { TestBed } from '@angular/core/testing';

import { FenCollectionsService } from './fen-collections.service';

describe('FenCollectionsService', () => {
  let service: FenCollectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FenCollectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
