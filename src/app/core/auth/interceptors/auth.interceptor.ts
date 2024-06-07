import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Auth0Service } from "../../services/auth0.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth0Service: Auth0Service) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the authentication token from the AuthService
    const token = this.auth0Service.getAccessToken();

    // Clone the request and add the token as an Authorization header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Pass the cloned request to the next handler
    return next.handle(request);
  }
}
