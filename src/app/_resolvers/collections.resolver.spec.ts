import { TestBed } from '@angular/core/testing';

import { CollectionsResolver } from './collections.resolver';

describe('CollectionsResolver', () => {
  let resolver: CollectionsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CollectionsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
