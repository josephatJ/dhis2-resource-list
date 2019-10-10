import { TestBed } from '@angular/core/testing';

import { FileManageService } from './file-manage.service';

describe('FileManageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileManageService = TestBed.get(FileManageService);
    expect(service).toBeTruthy();
  });
});
