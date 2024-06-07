import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MonthlyCommitmentService } from './monthly-commitment.service';
import { EnvironmentService } from 'app/module/environment/environment.service';
import { MonthlyCommitmentInterface } from '../interface/my-giving';

describe('MonthlyCommitmentService', () => {
  let service: MonthlyCommitmentService;
  let httpMock: HttpTestingController;
  let environmentServiceMock: any;

  beforeEach(() => {
    environmentServiceMock = {
      readConfig: jest.fn().mockReturnValue({ revenueDomain: 'https://example.com' })
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MonthlyCommitmentService,
        { provide: EnvironmentService, useValue: environmentServiceMock }
      ]
    });

    service = TestBed.inject(MonthlyCommitmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch monthly commitment details', () => {
    const mockResponse: MonthlyCommitmentInterface = {
      isSuccess: false,
      message: '',
      data: {
        count: 0,
        value: []
      }
    };

    service.getMonthlyCommitmentDetails().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://example.com/api/MonthlyDonation/getmonthlydonation?lookupId=2199261');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
