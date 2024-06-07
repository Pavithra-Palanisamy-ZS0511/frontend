import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyGivingTransactionsComponent } from './transactions.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, Store } from '@ngrx/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { loadTransactions } from '../../../state/actions/transactions.actions';
import { MyGivingInterface } from 'app/core/interface/my-giving';
import { of } from 'rxjs';

describe('MyGivingTransactionsComponent', () => {
  let component: MyGivingTransactionsComponent;
  let fixture: ComponentFixture<MyGivingTransactionsComponent>;
  let store: MockStore;
  const initialState: MyGivingInterface = {
    ytdGiving: 0,
    totalGiving: 0,
    supporterInYear: 0,
    transactions: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyGivingTransactionsComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        HttpClientModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGivingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTransactions action on ngOnInit', () => {
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(loadTransactions({ email: 'example@email.com', year: 'all' }));
  });

  it('should update component properties after successful transaction data retrieval', () => {
    const mockTransactions = [
      {
        transactionId: '1',
        date: '2024-06-01',
        amount: 100,
        program: 'Test Program',
        taxReceipt: 'Test Receipt'
      }
    ];
    const mockTransactionData = {
      isSuccess: true,
      data: {
        ytdGiving: 100,
        totalGiving: 1000,
        noOfYears: 3,
        transactions: mockTransactions
      }
    };
    component.transactionDetails$ = of(mockTransactionData);
    component.ngOnInit();
    expect(component.ytdGiving).toEqual(100);
    expect(component.totalGiving).toEqual(1000);
    expect(component.noOfYears).toEqual(3);
    expect(component.recentTransactionsDataSource.data).toEqual(mockTransactions);
  });


  afterEach(() => {
    fixture.destroy();
  });
});
