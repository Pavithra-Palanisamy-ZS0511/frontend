import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { Auth0Service } from "app/core/services/auth0.service";
import { EnvironmentService } from "app/module/environment/environment.service";
import { Observable, Subscription } from "rxjs";
import { tap, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  private userSubscription: Subscription;
  constructor(
    private auth0Service: Auth0Service,
    private authService: AuthService,
    private environmentService: EnvironmentService
  ) {}
  // getting backend domain api url
  config = this.environmentService.readConfig();
  apiUrl = this.config.authorizationDomain; // Using config data for API URL

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // getting value from signup url
    let queryParams = route.queryParamMap.get("param");
    if (queryParams) {
      queryParams = encodeURIComponent(queryParams);
      // locally storing the param value for update metadata and destroy it in the end of function
      localStorage.setItem("param", queryParams);
    }
    //passing these parameter to auth0 custom login screen
    const additionalParams = queryParams
      ? { param: queryParams, isLogin: false, domainUrl: this.apiUrl }
      : { param: null, isLogin: true, domainUrl: this.apiUrl };
    return this.authService.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.authService.loginWithRedirect({
            appState: {
              target: "/", // Original target URL
            },
            // Pass additional parameters when redirecting to login/signup
            authorizationParams: additionalParams,
          });
        }
      }),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          const storedParam = localStorage.getItem("param");
          if (storedParam) {
            this.authService.user$.subscribe((user) => {
              if (user) {
                // update lookup into auth0 profile
                this.auth0Service
                  .processMetaData(storedParam, user.user_id)
                  .subscribe((result) => {
                    console.log(result);
                  });
              }
            });
            localStorage.removeItem("param");
          }
          this.userSubscription = this.authService.user$.subscribe((user) => {
            if (user) {
              localStorage.setItem("email", user.email);
            }
          });
          this.auth0Service.setAccessToken();
        }
        return isAuthenticated;
      })
    );
  }

  ngOnDestroy() {
    if (this.userSubscription) {
        this.userSubscription.unsubscribe();
    }
  }
}
