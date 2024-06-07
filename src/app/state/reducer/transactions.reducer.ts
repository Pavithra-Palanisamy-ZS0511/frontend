import { createReducer, on } from '@ngrx/store';
import * as TransactionActions from '../actions/transactions.actions';
import { MyGivingInterface, TransactionHistoryInterface } from 'app/core/interface/my-giving';

export interface TransactionState {
    transactionsData: any;
  loading: boolean;
  error: any;
}

export const initialState: TransactionState = {
    transactionsData: null,
  loading: false,
  error: null
};

export const transactionReducer = createReducer(
  initialState,
  on(TransactionActions.loadTransactions, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TransactionActions.loadTransactionsSuccess, (state, { transactionsData }) => ({
    ...state,
    transactionsData,
    loading: false
  })),
  on(TransactionActions.loadTransactionsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
