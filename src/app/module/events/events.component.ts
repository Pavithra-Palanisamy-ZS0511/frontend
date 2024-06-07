import { DatePipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { EventsService } from 'app/core/services/events.service';
import { MatButtonModule } from '@angular/material/button';
import { NotFoundComponent } from 'app/shared/not-found/not-found.component';
import { ASSET_KEYS } from 'app/core/utils/constant/AssetConstants';
import { GLOBAL_MESSAGES } from 'app/core/utils/constant/StringConstant';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguagesComponent } from 'app/shared/languages/languages.component';
import { LoaderComponent } from 'app/shared/loader/loader.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports      : [MatFormFieldModule, LanguagesComponent, LoaderComponent, TranslocoModule, NotFoundComponent, NgIf, DatePipe, MatInputModule, FuseCardComponent, MatIconModule, MatTooltipModule, MatProgressBarModule, RouterLink, PercentPipe, MatExpansionModule, NgFor, MatButtonModule],
})
export class EventsComponent {

  globalMessage = GLOBAL_MESSAGES;
  participantId: number = GLOBAL_MESSAGES.participantId;   
  userName: string = GLOBAL_MESSAGES.userName;
  passWord: string = GLOBAL_MESSAGES.passWord;
  upcomingEvents: string[];
  pastEvents: string[];
  noEvents: boolean;
  upcomingEventsSuggestion: string[];
  currentYearEvents: string[];
  eventsYearWise:{};
  assetKeys = ASSET_KEYS;
  showPastEvents: boolean = true;
  isLoading: boolean = false;
  dataSubscription: Subscription;
  currentYear = new Date().getFullYear().toString();
  constructor(private _eventService : EventsService){

  }

  ngOnInit(){
    this.isLoading = true;
    this.dataSubscription = this._eventService.getEventDetails(this.participantId, this.userName, this.passWord).subscribe(
      (response) => {
        if(response.isSuccess){
          if(response?.data?.pastEvents?.length != 0 || response?.data?.upcomingEvents?.length != 0){
            this.noEvents = false;
            this.isLoading = false;
          this.upcomingEvents = response.data.upcomingEvents;
          this.pastEvents = response.data.pastEvents;
          if(this.pastEvents.length == 0){
          this.showPastEvents = false;
          }
          this.currentYearEvents = this.getCurrentYearEvents(response?.data?.eventsByYear, this.currentYear);
          this.eventsYearWise = this.extractEventsYearWise(response?.data?.eventsByYear);
          } else if((response?.data?.pastEvents?.length == 0 || response?.data?.upcomingEvents?.length == 0) && response?.data?.allUpcomingEvents?.length != 0){
            this.upcomingEventsSuggestion = response.data.allUpcomingEvents;
            this.noEvents = true;
            this.isLoading = false;
          }
        }
  });

}

getYears(): string[] {
  if (!this.eventsYearWise) {
    return [];
  }
  return Object.keys(this.eventsYearWise).filter(year => year !== this.currentYear && this.eventsYearWise[year].length > 0);
}

getCurrentYearEvents(events, year) {
  return events[year] || [];
}


extractEventsYearWise(events) {
  const result = {};
  
  for (const year in events) {
      if (events.hasOwnProperty(year)) {
          result[year] = events[year];
      }
  }
  
  return result;
}


ngOnDestroy(): void {
  if (this.dataSubscription) {
    this.dataSubscription.unsubscribe(); 
  }
}

}
