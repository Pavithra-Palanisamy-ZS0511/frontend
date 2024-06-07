import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TransactionState } from '../reducer/transactions.reducer';

export const selectTransactionState = createFeatureSelector<TransactionState>('transactions');

export const selectTransactions = createSelector(
  selectTransactionState,
  (state: TransactionState) => state.transactionsData
);

export const selectTransactionLoading = createSelector(
  selectTransactionState,
  (state: TransactionState) => state.loading
);

export const selectTransactionError = createSelector(
  selectTransactionState,
  (state: TransactionState) => state.error
);


