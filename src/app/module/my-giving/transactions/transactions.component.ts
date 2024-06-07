import { CommonModule, NgIf } from "@angular/common";
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FuseAlertComponent } from "@fuse/components/alert";
import { FuseCardComponent } from "@fuse/components/card";
import { TranslocoModule } from "@ngneat/transloco";
import {
  MyGivingInterface,
  TransactionHistoryInterface,
  TransactionsPagination,
} from "app/core/interface/my-giving";
import { TransactionHistoryService } from "app/core/services/transaction-history.service";
import { ASSET_KEYS } from "app/core/utils/constant/AssetConstants";
import {
  GLOBAL_MESSAGES,
  TRANSACTION_MOCK_DATA,
} from "app/core/utils/constant/StringConstant";
import { NotFoundComponent } from "app/shared/not-found/not-found.component";
import { Subject, takeUntil, merge, switchMap, map, Observable, filter, catchError, of, Subscription } from "rxjs";
import { Store } from '@ngrx/store';
import { loadTransactions } from "app/state/actions/transactions.actions";
import { TransactionState } from "app/state/reducer/transactions.reducer";
import { selectTransactionError, selectTransactionLoading, selectTransactions } from "app/state/selectors/transactions.selectors";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ERROR_MESSAGE } from "app/core/utils/constant/ErrorConstants";

@Component({
  selector: "my-giving-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FuseAlertComponent,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    FontAwesomeModule,
    FuseCardComponent,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    NotFoundComponent,
    TranslocoModule,
    MatPaginatorModule,
    NgIf,
  ],
})
export class MyGivingTransactionsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  @ViewChild(MatSort) _sort: MatSort;
  @ViewChild("recentTransactionsTable", { read: MatSort })
  data: any;
  isTransactionData: boolean = false;
  isMobileView: boolean;
  transactionForm: FormGroup;
  transactions: MyGivingInterface;
  assetKeys = ASSET_KEYS;
  globalMessage = GLOBAL_MESSAGES;
  transactionMockData = TRANSACTION_MOCK_DATA;

  recentTransactionsTableMatSort: MatSort;
  recentTransactionsTableColumns: string[] = [
    "date",
    "amount",
    "program",
    "taxReceipt",
  ];
  transactionsOptions: string[] = ["All", "2024", "2023", "2022"];
  selectedTransactionOption: string = "All";
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;
  pagination: TransactionsPagination;
  recentTransactionsDataSource: MatTableDataSource<TransactionHistoryInterface> =
    new MatTableDataSource<TransactionHistoryInterface>();
  email: string;
  
  transactionsData$: Observable<MyGivingInterface>;
  transactionDetails$: Observable<any>;
  transactionError$: Observable<any>; 
  horizontalPosition: "start" | "center" | "end" | "left" | "right" = "right";
  verticalPosition: "top" | "bottom" = "top";
  selectedValue: string[] = [];
  errorMessage = ERROR_MESSAGE;
  ytdGiving: any;
  totalGiving: any;
  noOfYears: any;
  transactionDataSubscription: Subscription;

  constructor(
    private transactionService: TransactionHistoryService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private store: Store<{ contact: TransactionState }>,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {
    this.checkScreenSize();
    this.transactionDetails$ = this.store.select(
      selectTransactions
    );
    this.transactionError$ = this.store.select(
      selectTransactionError
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

  ngOnInit(): void {
    this.checkScreenSize();

    this.transactionForm = this._formBuilder.group({
      transactionSelectFilter: ["All"],
    });
    this.email = localStorage.getItem("email");
    this.store.dispatch(loadTransactions({email: this.email, year:'all'}));
    this.transactionDataSubscription = this.transactionDetails$
      .pipe(filter(transactionsData => !!transactionsData)) 
      .subscribe(transactionsData => {
        const transactionResponseData = transactionsData;
        if(transactionResponseData.isSuccess){
        
              this.ytdGiving = transactionResponseData.data.ytdGiving;
              this.totalGiving = transactionResponseData.data.totalGiving;
              this.noOfYears = transactionResponseData.data.noOfYears;
              this.recentTransactionsDataSource.data = transactionResponseData.data.transactions;
              this.recentTransactionsDataSource.paginator = this._paginator;
              this.recentTransactionsDataSource.sort = this._sort;
              if(!transactionResponseData.data.transactions){
                this.isTransactionData = true;
              }
        } else {
          this.showSnackBar(
            this.errorMessage.errorDuringServiceCall,
            "app-notification-error"
          );
          this.isLoading = false;
          return of([]);
        }
      
      });
    this.transactionDataSubscription = this.transactionError$
    .subscribe(error => {
      if (error) {
          this.showSnackBar(
            this.errorMessage.errorDuringServiceCall,
            "app-notification-error"
          );
          this.isLoading = false;
          return of([]);
      }
    });
    
  }

  onTransactionOptionSelected(option: string): void {
    console.log('Selected option:', option);
    this.store.dispatch(loadTransactions({email: this.email, year: option}));
  }
  

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 960;
  }

  @HostListener("window:resize")
  onResize() {
    this.checkScreenSize();
    this._changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    if (this.recentTransactionsTableMatSort) {
      this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
    }
  }

  ngOnDestroy(): void {
    if(this.transactionDataSubscription){
      this.transactionDataSubscription.unsubscribe();
    }
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
