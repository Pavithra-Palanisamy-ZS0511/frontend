import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnvironmentService } from "app/module/environment/environment.service";
import { Observable } from "rxjs";
import { MonthlyCommitmentInterface } from "../interface/my-giving";

@Injectable({
  providedIn: "root",
})
export class MonthlyCommitmentService {
  lookupId: number = 2199261; // static loopupId. In future it will change to dynamic
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getMonthlyCommitmentDetails(): Observable<MonthlyCommitmentInterface> {
    let config = this.environmentService.readConfig();

    const apiUrl = config.revenueDomain;
    return this.http.get<MonthlyCommitmentInterface>(
      `${apiUrl}/MonthlyDonation/getmonthlydonation?lookupId=${this.lookupId}`
    );
  }
}
