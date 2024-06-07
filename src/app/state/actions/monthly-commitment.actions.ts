import { createAction, props } from '@ngrx/store';
import { MonthlyCommitmentInterface } from 'app/core/interface/my-giving';

export const loadMonthlyCommitment = createAction(
  '[Monthly Commitment] Load Monthly Commitment',
);

export const loadMonthlyCommitmentSuccess = createAction(
  '[Monthly Commitment] Load Monthly Commitment Success',
  props<{ monthlyCommitmentDetails: MonthlyCommitmentInterface['data']['value'] }>()
);

export const loadMonthlyCommitmentFailure = createAction(
  '[Monthly Commitment] Load Monthly Commitment Failure',
  props<{ error: any }>()
);