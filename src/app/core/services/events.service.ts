import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Environment } from "environment";
import { Observable } from "rxjs";
import { EnvironmentConfig } from "app/module/environment/environment.model";
import { EnvironmentService } from "app/module/environment/environment.service";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  private _httpClient = inject(HttpClient);

  constructor(private environmentService: EnvironmentService) {}

  getEventDetails(
    participantId: number,
    userName: string,
    password: string
  ): Observable<any> {
    let config = this.environmentService.readConfig();

    const apiUrl = config.campaignsDomain;
    const url = `${apiUrl}/Events/filtered-events/${participantId}?userName=${userName}&password=${password}`;

    return this._httpClient.get<any>(url);
  }
}
