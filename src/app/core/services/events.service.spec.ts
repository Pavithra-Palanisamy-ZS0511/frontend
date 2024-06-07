import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventsService } from './events.service';
import { Environment } from 'environment';
import { EnvironmentService } from "app/module/environment/environment.service";

describe('EventsService', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;
  let environmentService: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventsService]
    });
    service = TestBed.inject(EventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch event details for a participant', () => {
    const participantId = 123;
    const userName = "zuciParticipant";
    const password = "I5mYyHTnStkceMC";
    let config = environmentService.readConfig();

    const apiUrl = config.campaignsDomain;
    const mockResponse = {
      isSuccess: true,
      data: {
        upcomingEvents: ['Event 1', 'Event 2'],
        pastEvents: ['Event 3', 'Event 4']
      }
    };

    service.getEventDetails(participantId, userName, password).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/Event/filtered-events/${participantId}?userName=${userName}&password=${password}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
