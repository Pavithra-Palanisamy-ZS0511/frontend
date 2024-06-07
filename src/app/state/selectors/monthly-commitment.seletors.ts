import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MonthlyCommitmentState } from "../reducer/monthly-commitment.reducer";

const featureKey = "monthlyCommitment";
export const selectMonthlyCommitmentState =
  createFeatureSelector<MonthlyCommitmentState>(featureKey);

export const selectMonthlyCommitmentDetails = createSelector(
  selectMonthlyCommitmentState,
  (state: MonthlyCommitmentState) => state.monthlyCommitment
);

export const selectMonthlyCommitmentError = createSelector(
  selectMonthlyCommitmentState,
  (state: MonthlyCommitmentState) => state.error
);