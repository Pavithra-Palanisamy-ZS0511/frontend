import { Injectable } from "@angular/core";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { EnvironmentConfig } from "./environment.model";

@Injectable({
  providedIn: "root",
})
export class EnvironmentService {
  private environmentConfig: EnvironmentConfig;

  constructor(private handler: HttpBackend, private httpClient: HttpClient) {
    this.httpClient = new HttpClient(handler);
  }

  setConfig(): Promise<EnvironmentConfig> {
    return lastValueFrom(
      this.httpClient.get<EnvironmentConfig>("./environment-config.json")
    ).then((config) => {
      this.environmentConfig = config;
      return config;
    });
  }

  readConfig(): EnvironmentConfig {
    return this.environmentConfig;
  }
}
