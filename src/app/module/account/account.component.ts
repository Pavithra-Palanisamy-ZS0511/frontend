import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject, takeUntil } from "rxjs";
import { AccountMyProfileComponent } from "./my-profile/my-profile.component";
import { AccountContactDetailsComponent } from "./contact-details/contact-details.component";
import { AccountPaymentMethodComponent } from "./payment-method/payment-method.component";
import { AccountSecurityComponent } from "./security/security.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GLOBAL_MESSAGES } from "app/core/utils/constant/StringConstant";
import { TranslocoModule } from "@ngneat/transloco";
import { SidebarNavigationService } from "app/core/services/sidebar-navigation.service";

@Component({
  selector: "account",
  templateUrl: "./account.component.html",
  styleUrl: "./account.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    AccountMyProfileComponent,
    AccountSecurityComponent,
    AccountPaymentMethodComponent,
    AccountContactDetailsComponent,
    FontAwesomeModule,
    TranslocoModule,
    NgIf,
  ],
})
export class AccountComponent implements OnInit , OnDestroy {
  @ViewChild("drawer") drawer: MatDrawer;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  panels: any[] = [];
  globalMessage = GLOBAL_MESSAGES;
  selectedPanel: string = "myProfileAccountMenu";
  focusedPanel: string;
  @ViewChildren("panelButton") buttons: QueryList<ElementRef>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _sidebarNavigationService: SidebarNavigationService
  ) {}

  ngOnInit(): void {
    // Setup available panels
    this.panels = [
      {
        id: "myProfileAccountMenu",
        icon: "feather:fa-pro-user-vneck",
        title: "My Profile",
      },
      {
        id: "contactDetailsAccountMenu",
        icon: "feather:fa-pro-messages",
        title: "Contact Details",
      },
      {
        id: "securityAccountMenu",
        icon: "feather:fa-pro-shield-keyhole",
        title: "Security",
      },
    ];

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode and drawerOpened
        if (matchingAliases.includes("lg")) {
          this.drawerMode = "side";
          this.drawerOpened = true;
        } else {
          this.drawerMode = "over";
          this.drawerOpened = false;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  ngAfterViewInit() {
    this.buttons.changes.subscribe(() => {
      this.buttons = this.buttons;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  goToPanel(panel: string): void {
    this.selectedPanel = panel;

    // Close the drawer on 'over' mode
    if (this.drawerMode === "over") {
      this.drawer.close();
    }
  }

  getPanelInfo(id: string): any {
    return this.panels.find((panel) => panel.id === id);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  handleKeyDown(event: KeyboardEvent, panelId: string): void {
    this._sidebarNavigationService.handleKeyDown(event, panelId, this.panels, this.buttons);
  }

  handleFocus(panelId: string): void {
    this._sidebarNavigationService.handleFocus(panelId);
  }

  handleBlur(): void {
    this._sidebarNavigationService.handleBlur();
  }
}
