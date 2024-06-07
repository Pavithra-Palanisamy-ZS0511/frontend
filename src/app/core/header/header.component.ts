import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject, takeUntil } from "rxjs";
import { ASSET_KEYS } from "../utils/constant/AssetConstants";
import { GLOBAL_MESSAGES } from "../utils/constant/StringConstant";
import { UserComponent } from "app/shared/user/user.component";
import { CommonModule } from "@angular/common";
import { LanguagesComponent } from "app/shared/languages/languages.component";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  standalone: true,
  imports: [UserComponent, RouterModule, CommonModule, LanguagesComponent, TranslocoModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  assetKeys = ASSET_KEYS;
  globalMessage = GLOBAL_MESSAGES;
  isScreenSmall: boolean;
  showHeader: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        this.isScreenSmall = !matchingAliases.includes("md");
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // Getter for current year
  get currentYear(): number {
    return new Date().getFullYear();
  }
  // Check it active
  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
