import { NgClass, NgFor, NgSwitch, NgSwitchCase } from "@angular/common";
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
import { ReplaySubject, Subject, takeUntil } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GLOBAL_MESSAGES } from "app/core/utils/constant/StringConstant";
import { MyGivingTransactionsComponent } from "./transactions/transactions.component";
import { MonthlyCommitmentComponent } from "./monthly-commitment/monthly-commitment.component";
import { ASSET_KEYS } from "app/core/utils/constant/AssetConstants";
import { TranslocoModule } from "@ngneat/transloco";
import { SidebarNavigationService } from "app/core/services/sidebar-navigation.service";

@Component({
  selector: "my-giving",
  templateUrl: "./my-giving.component.html",
  styleUrl: "./my-giving.component.scss",
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
    MyGivingTransactionsComponent,
    FontAwesomeModule,
    MonthlyCommitmentComponent,
    TranslocoModule,
  ],
})
export class MyGivingComponent implements OnInit, OnDestroy {
  @ViewChild("drawer") drawer: MatDrawer;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = "transactionsMyGivingMenu";
  globalMessage = GLOBAL_MESSAGES;
  assetConstants = ASSET_KEYS;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  focusedPanel: string;
  @ViewChildren("panelButton") buttons: QueryList<ElementRef>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _sidebarNavigationService: SidebarNavigationService
  ) {
    // this.translateTitles();
  }

  ngOnInit(): void {
    // Setup available panels
    this.panels = [
      {
        id: "transactionsMyGivingMenu",
        icon: "feather:fa-pro-regular-money-bill-transfer",
      },
      {
        id: "monthlyCommitmentMyGivingMenu",
        icon: "feather:fa-pro-regular-calendar-clock",
      }
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
