import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor() {}

  logError(error: any): void {
    console.error("Error occurred:", error);
    // we can implement logic here to maintain logs
  }
}
