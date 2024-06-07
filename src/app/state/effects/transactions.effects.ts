import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { TransactionHistoryService } from 'app/core/services/transaction-history.service';
import * as TransactionActions from '../actions/transactions.actions';

@Injectable()
export class TransactionEffects {

  loadContactInformation$ = createEffect(() => this.actions$.pipe(
    ofType(TransactionActions.loadTransactions),
    mergeMap(action =>
      this.transactionService.getTransactions(action.email, action.year).pipe(
        tap(response => {
            console.log('Response:', response); 
          }),
        map(response => {
          const transactionsData = response;
          return TransactionActions.loadTransactionsSuccess({ transactionsData });
        }),
        catchError(error => {
            console.error('Error:', error); 
            return of(TransactionActions.loadTransactionsFailure({ error }));
          })
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private transactionService: TransactionHistoryService
  ) {}
}
