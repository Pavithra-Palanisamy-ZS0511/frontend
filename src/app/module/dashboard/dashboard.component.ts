import { Component } from "@angular/core";
import { FuseCardComponent } from "@fuse/components/card/card.component";
import { ASSET_KEYS } from "app/core/utils/constant/AssetConstants";
import {
  GLOBAL_MESSAGES,
  TRANSACTION_MOCK_DATA,
} from "app/core/utils/constant/StringConstant";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FuseAlertComponent } from "@fuse/components/alert";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LanguagesComponent } from 'app/shared/languages/languages.component';
import { TranslocoModule } from '@ngneat/transloco';
import { EventsService } from 'app/core/services/events.service';
import { CurrencyPipe, DatePipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import { TransactionHistoryService } from 'app/core/services/transaction-history.service';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { FooterComponent } from "app/core/footer/footer.component";
import { DomSanitizer } from '@angular/platform-browser';
import { Auth0Service } from "app/core/services/auth0.service";
import { ErrorHandlerService } from "app/core/services/error-handler.service";
import { AuthService } from "app/core/auth/auth.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [FuseCardComponent, NgFor, PercentPipe, MatTooltipModule, FooterComponent, CurrencyPipe, NgIf, DatePipe, LanguagesComponent, TranslocoModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, FuseAlertComponent, FontAwesomeModule, RouterModule, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  assetKeys = ASSET_KEYS;
  globalMessage = GLOBAL_MESSAGES;
  transactionMockData = TRANSACTION_MOCK_DATA;
  profileId: number = 2423423324;
  firstName: string = "Randy";
  name: string = "Randy Botosh";
  participantId: number = 987;   
  userName: string = "zuciParticipant";
  passWord: string = "I5mYyHTnStkceMC";
  upcomingEvents: string[];
  noEvents: boolean;
  transactions: string[];
  isTransactionData: boolean;
  recentTransactionsDataSource: any;
  transactionForm: any;
  _formBuilder: any;
  teamname: string;
  eventDataSubscription: Subscription;
  transactionsDataSubscription: Subscription;
  accountSubscription: Subscription;
  upcomingEventsSuggestion: string[];
  isVideoPlaying = false;
  email: string;
  profileDetails: any;

  constructor(
    private _eventService: EventsService,
    private transactionService: TransactionHistoryService,
    public sanitizer: DomSanitizer,
    private auth0: Auth0Service,
    private _authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {
    
  }

  ngOnInit() {
    this.email= localStorage.getItem("email");
    this.eventDataSubscription = this._eventService
      .getEventDetails(this.participantId, this.userName, this.passWord)
      .subscribe((response) => {
        if (response.isSuccess) {
          if (response?.data?.upcomingEvents?.length != 0) {
            this.noEvents = false;
            this.upcomingEvents = response.data.upcomingEvents;
          } else if (response?.data?.upcomingEvents?.length == 0) {
            this.noEvents = true;
          }
          if (response?.data?.allUpcomingEvents?.length != 0) {
            this.upcomingEventsSuggestion = response.data.allUpcomingEvents;
            this.noEvents = true;
          }
          if(response?.data?.allUpcomingEvents?.length != 0){
            this.upcomingEventsSuggestion = response.data.allUpcomingEvents;
            this.noEvents = true;
          }
        }
      });

    this.transactionsDataSubscription = this.transactionService
      .getTransactions(this.email, 'all')
      .subscribe((response) => {
        if (response) {
          this.recentTransactionsDataSource = response.transactions?.slice(
            0,
            4
          );
        }
      });
      
      this.accountInfo(this.email);
  }

  accountInfo(email): void{
    this.accountSubscription = this._authService.viewProfile(email).subscribe((response) => {
      if(response){
        this.profileDetails = response;
      }
    });
  }
  

  playVideo() {
    this.isVideoPlaying = true;
  }

  ngOnDestroy(): void {
    if (this.eventDataSubscription) {
      this.eventDataSubscription.unsubscribe();
    }
    if (this.transactionsDataSubscription) {
      this.transactionsDataSubscription.unsubscribe();
    }
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }
}
