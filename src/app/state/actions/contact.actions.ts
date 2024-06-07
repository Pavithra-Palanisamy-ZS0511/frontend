import { createAction, props } from '@ngrx/store';

export const loadContactInformation = createAction(
  '[Contact] Load Contact Information',
  props<{ email: string }>()
);

export const loadContactInformationSuccess = createAction(
  '[Contact] Load Contact Information Success',
  props<{ contactDetails: any }>()
);

export const loadContactInformationFailure = createAction(
  '[Contact] Load Contact Information Failure',
  props<{ error: any }>()
);
    
