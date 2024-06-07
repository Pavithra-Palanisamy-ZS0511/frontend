import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { EnvironmentService } from "app/module/environment/environment.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Auth0Service {
  private _httpClient = inject(HttpClient);
  constructor(
    private auth0: AuthService,
    private environmentService: EnvironmentService
  ) {}

  login(): void {
    this.auth0.loginWithRedirect();
  }

  getAccessToken(): string | null {
    return localStorage.getItem("token");
  }

  setAccessToken(): void {
    this.auth0.getAccessTokenSilently().subscribe((accessToken) => {
      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }
    });
  }

  logout(): void {
    localStorage.removeItem("token");
    this.auth0.logout();
  }

  authUser() {
    return this.auth0.user$;
  }

  processMetaData(param: any, userId: any): Observable<any> {
    // Corrected parameter types
    const config = this.environmentService.readConfig();
    const apiUrl = config.authorizationDomain; // Using config data for API URL
    const url = `${apiUrl}/Authentication/UpdateMetaDataProcess?param=${param}&userId=${userId}`;
    return this._httpClient.get<any>(url);
  }
}
