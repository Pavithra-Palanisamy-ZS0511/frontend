import { createReducer, on, Action } from "@ngrx/store";
import * as MonthlyCommitmentAction from "../actions/monthly-commitment.actions";

export interface MonthlyCommitmentState {
  monthlyCommitment: any | null;
  error: any | null;
}

export const initialState: MonthlyCommitmentState = {
  monthlyCommitment: null,
  error: null,
};

export const monthlyCommitmentReducer = createReducer(
  initialState,
  on(
    MonthlyCommitmentAction.loadMonthlyCommitmentSuccess,
    (state, { monthlyCommitmentDetails }) => ({
      ...state,
      monthlyCommitment: monthlyCommitmentDetails,
      error: null,
    })
  ),
  on(
    MonthlyCommitmentAction.loadMonthlyCommitmentFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  )
);
