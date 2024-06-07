import { CommonModule, DatePipe, NgFor, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FuseAlertComponent } from "@fuse/components/alert";
import { GLOBAL_MESSAGES } from "app/core/utils/constant/StringConstant";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { TranslocoModule } from "@ngneat/transloco";
import {
  MonthlyCommitmentInterface,
  MonthlyCommitmentResponse,
} from "app/core/interface/my-giving";
import { Subject, catchError, map, of, takeUntil, tap } from "rxjs";
import { LoaderComponent } from "app/shared/loader/loader.component";
import { NotFoundComponent } from "app/shared/not-found/not-found.component";
import { ASSET_KEYS } from "app/core/utils/constant/AssetConstants";

import { Store } from "@ngrx/store";
import { loadMonthlyCommitment } from "app/state/actions/monthly-commitment.actions";
import { MonthlyCommitmentState } from "app/state/reducer/monthly-commitment.reducer";
import {
  selectMonthlyCommitmentDetails,
  selectMonthlyCommitmentError,
} from "../../../state/selectors/monthly-commitment.seletors";
import { Observable, Subscription, filter } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ERROR_MESSAGE } from "app/core/utils/constant/ErrorConstants";
@Component({
  selector: "my-giving-monthly-commitment",
  templateUrl: "./monthly-commitment.component.html",
  styleUrl: "./monthly-commitment.component.scss",
  standalone: true,
  imports: [
    CommonModule,
    FuseAlertComponent,
    MatIcon,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatRadioModule,
    TranslocoModule,
    NgIf,
    NgFor,
    LoaderComponent,
    DatePipe,
    NotFoundComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyCommitmentComponent implements OnInit, OnDestroy {
  isDisabled: boolean = true;
  globalMessage = GLOBAL_MESSAGES;
  assetKeys = ASSET_KEYS;
  errorMessage = ERROR_MESSAGE;
  formFieldHelpers: string[] = [""];
  monthlyDonation: number = 50.0;
  nextTransactionDate: string = "Jun 01, 2024";
  directBankDebitNum: string = "****4636";
  creditCardNum: string = "****8847";
  selectedValue: string[] = [];
  monthlyCommitments$: Observable<MonthlyCommitmentResponse>;
  monthlyCommitments: MonthlyCommitmentResponse[] = [];
  monthlyCommitmentsCount: number = 0;
  isLoading: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  monthlyCommitmentDetails$: Observable<MonthlyCommitmentInterface>;
  monthlyCommitmentError$: Observable<any>;
  monthlyCommitmentSubscription: Subscription;
  horizontalPosition: "start" | "center" | "end" | "left" | "right" = "right";
  verticalPosition: "top" | "bottom" = "top";
  constructor(
    private cdr: ChangeDetectorRef,
    private store: Store<{ monthlyCommitmentState: MonthlyCommitmentState }>,
    private _snackBar: MatSnackBar
  ) {
    this.monthlyCommitmentDetails$ = this.store.select(
      selectMonthlyCommitmentDetails
    );
    this.monthlyCommitmentError$ = this.store.select(
      selectMonthlyCommitmentError
    );
  }

  private showSnackBar(
    message: string,
    panelClass: string,
    duration: number = 3000
  ) {
    this._snackBar.open(message, "", {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: panelClass,
    });
  }

  onChange(event, index) {
    this.selectedValue[index] = event.value;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.store.dispatch(loadMonthlyCommitment());

    this.monthlyCommitments$ = this.monthlyCommitmentDetails$.pipe(
      filter((response: any) => !!response),
      map((response: any) => {
        const commitmentResponseData = response;
        if (
          commitmentResponseData &&
          Array.isArray(commitmentResponseData.value)
        ) {
          this.monthlyCommitmentsCount = commitmentResponseData.count;
          this.selectedValue = commitmentResponseData.value.map(
            (commitment: any) =>
              commitment.payment_method === "Check"
                ? "debit-card"
                : "credit-card"
          );
          this.isLoading = false;
          return commitmentResponseData.value;
        }
        return [];
      }),
      catchError((error) => {
        this.showSnackBar(
          this.errorMessage.errorDuringServiceCall,
          "app-notification-error"
        );
        this.isLoading = false;
        return of([]);
      }),
      takeUntil(this._unsubscribeAll)
    );

    this.monthlyCommitments$.subscribe((data: any) => {
      this.monthlyCommitments = data;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
