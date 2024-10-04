import { TestBed } from '@angular/core/testing';

import { MediaChangeViewService } from './media-change-view.service';

describe('MediaChangeViewService', () => {
  let service: MediaChangeViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaChangeViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
