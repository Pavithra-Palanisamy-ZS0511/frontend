import { user } from "./../../mock-api/common/user/data";
import { NgClass, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Router, RouterModule } from "@angular/router";
import { Auth0Service } from "app/core/services/auth0.service";
import { TranslocoModule } from "@ngneat/transloco";
import { ASSET_KEYS } from "app/core/utils/constant/AssetConstants";
import { GLOBAL_MESSAGES } from "app/core/utils/constant/StringConstant";
import { ErrorHandlerService } from "app/core/services/error-handler.service";
import { Subscription } from "rxjs";
import { AuthService } from "app/core/auth/auth.service";

@Component({
  selector: "user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: "user",
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    NgIf,
    MatIconModule,
    NgClass,
    MatDividerModule,
    RouterModule,
    TranslocoModule,
  ],
})
export class UserComponent {
  assetKeys = ASSET_KEYS;
  globalMessage = GLOBAL_MESSAGES;
  isScreenSmall: boolean = false;
  user: any;
  accountSubscription: Subscription;
  profileDetails: any;

  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private auth0: Auth0Service,
    private _authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.checkScreenSize();
    this.auth0.authUser().subscribe(
      (user) => {
        this.user = user;
      },
      (error) => {
        this.errorHandlerService.logError(error); 
      }
    );
    
    this.accountInfo(localStorage.getItem('email'));
   
  }

  accountInfo(email): void{
    this.accountSubscription = this._authService.viewProfile(email).subscribe((response) => {
      if(response){
        this.profileDetails = response;
      }
    });
  }

  checkScreenSize() {
    this.isScreenSmall = window.innerWidth < 960;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.checkScreenSize();
  }

  logOut() {
    this.auth0.logout();
  }

  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }
}
