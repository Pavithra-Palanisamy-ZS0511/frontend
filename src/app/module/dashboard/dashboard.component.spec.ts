import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { EventsService } from 'app/core/services/events.service';
import { TransactionHistoryService } from 'app/core/services/transaction-history.service';
import { of } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LanguagesComponent } from 'app/shared/languages/languages.component';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let eventsService: EventsService;
  let transactionHistoryService: TransactionHistoryService;

  beforeEach(async () => {
    const eventsServiceMock = {
      getEventDetails: jest.fn().mockReturnValue(of({
        isSuccess: true,
        data: {
          upcomingEvents: [],
          allUpcomingEvents: []
        }
      }))
    };

    const transactionHistoryServiceMock = {
      getTransactions: jest.fn().mockReturnValue(of({
        transactions: [
          { program: 'Program 1', date: '2021-01-01', amount: 100, taxReceipt: true },
          { program: 'Program 2', date: '2021-02-01', amount: 200, taxReceipt: false },
          { program: 'Program 3', date: '2021-03-01', amount: 300, taxReceipt: true },
          { program: 'Program 4', date: '2021-04-01', amount: 400, taxReceipt: false },
        ]
      }))
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, LanguagesComponent, FuseAlertComponent],
      imports: [
        TranslocoModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        FontAwesomeModule,
        RouterModule,
        MatProgressBarModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        CurrencyPipe,
        DatePipe,
        PercentPipe,
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: TransactionHistoryService, useValue: transactionHistoryServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    eventsService = TestBed.inject(EventsService);
    transactionHistoryService = TestBed.inject(TransactionHistoryService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.profileId).toBe(2423423324);
    expect(component.firstName).toBe('Randy');
    expect(component.name).toBe('Randy Botosh');
    expect(component.participantId).toBe(987);
    expect(component.userName).toBe('zuciParticipant');
    expect(component.passWord).toBe('I5mYyHTnStkceMC');
    expect(component.upcomingEvents).toBeUndefined();
    expect(component.noEvents).toBeUndefined();
    expect(component.transactions).toBeUndefined();
    expect(component.isTransactionData).toBeUndefined();
    expect(component.recentTransactionsDataSource).toBeUndefined();
    expect(component.transactionForm).toBeUndefined();
    expect(component.teamname).toBeUndefined();
    expect(component.upcomingEventsSuggestion).toBeUndefined();
  });

  it('should call getEventDetails on init', () => {
    jest.spyOn(eventsService, 'getEventDetails').mockReturnValue(of({
      isSuccess: true,
      data: {
        upcomingEvents: ['Event 1', 'Event 2'],
        allUpcomingEvents: ['Event 3', 'Event 4']
      }
    }));
    component.ngOnInit();
    expect(eventsService.getEventDetails).toHaveBeenCalled();
    expect(component.upcomingEvents).toEqual(['Event 1', 'Event 2']);
    expect(component.upcomingEventsSuggestion).toEqual(['Event 3', 'Event 4']);
  });

  it('should unsubscribe from eventDataSubscription on destroy', () => {
    component.ngOnInit();
    const unsubscribeSpy = jest.spyOn(component.eventDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from transactionsDataSubscription on destroy', () => {
    component.ngOnInit();
    const unsubscribeSpy = jest.spyOn(component.transactionsDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
