import { TestBed, inject } from '@angular/core/testing';

import { BwcService } from './bwc.service';

describe('BwcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BwcService]
    });
  });

  it('should be created', inject([BwcService], (service: BwcService) => {
    expect(service).toBeTruthy();
  }));
});
