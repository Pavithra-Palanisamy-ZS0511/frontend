import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { EventsService } from '../../core/services/events.service';
import { of, throwError } from 'rxjs';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let eventsService: EventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsComponent],
      providers: [EventsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    eventsService = TestBed.inject(EventsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch event details on initialization', () => {
    const mockEventDetails = {
      isSuccess: true,
      data: {
        upcomingEvents: ['Event 1', 'Event 2'],
        pastEvents: ['Event 3', 'Event 4'],
        allUpcomingEvents: ['Event 5', 'Event 6'],
      },
    };
    spyOn(eventsService, 'getEventDetails').and.returnValue(of(mockEventDetails));

    component.ngOnInit();

    expect(eventsService.getEventDetails).toHaveBeenCalledWith(component.participantId);
    expect(component.noEvents).toBe(false);
    expect(component.upcomingEvents).toEqual(mockEventDetails.data.upcomingEvents);
    expect(component.pastEvents).toEqual(mockEventDetails.data.pastEvents);
    expect(component.upcomingEventsSuggestion).toBeUndefined();
  });

  it('should handle no past or upcoming events but all upcoming events', () => {
    const mockEventDetails = {
      isSuccess: true,
      data: {
        upcomingEvents: [],
        pastEvents: [],
        allUpcomingEvents: ['Event 5', 'Event 6'],
      },
    };
    spyOn(eventsService, 'getEventDetails').and.returnValue(of(mockEventDetails));

    component.ngOnInit();

    expect(component.noEvents).toBe(true);
    expect(component.upcomingEventsSuggestion).toEqual(mockEventDetails.data.allUpcomingEvents);
  });
  it('should handle error when fetching event details', () => {
    const errorMessage = 'Error fetching event details';
    spyOn(eventsService, 'getEventDetails').and.returnValue(throwError(errorMessage));

    component.ngOnInit();

    expect(component.noEvents).toBeUndefined();
    expect(component.upcomingEvents).toBeUndefined();
    expect(component.pastEvents).toBeUndefined();
    expect(component.upcomingEventsSuggestion).toBeUndefined();
  });

});
