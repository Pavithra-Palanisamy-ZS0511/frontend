import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { MyGivingInterface } from "../interface/my-giving";
import { EnvironmentService } from "app/module/environment/environment.service";

@Injectable({
  providedIn: "root",
})
export class TransactionHistoryService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getTransactions(email:string, year: string): Observable<MyGivingInterface> {
    let config = this.environmentService.readConfig();

    const apiUrl = config.transactionsDomain;
    return this.http.get<MyGivingInterface>(
      `${apiUrl}/Transactions/GetDonationDataAsync?fromDate=${year}&email=${email}`
    );
  }
}
