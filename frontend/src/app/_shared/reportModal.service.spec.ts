import { TestBed } from '@angular/core/testing';

import { ReportModalService } from './reportModal.service';

describe('ModalService', () => {
  let service: ReportModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
