import { createAction, props } from '@ngrx/store';

export const loadTransactions = createAction('[Transaction] Load Transactions',
props<{ email: string, year: string }>()
);

export const loadTransactionsSuccess = createAction(
    '[Transaction] Load Transactions Success',
    props<{ transactionsData: any }>()
  );

export const loadTransactionsFailure = createAction(
  '[Transaction] Load Transactions Failure',
  props<{ error: any }>()
);
