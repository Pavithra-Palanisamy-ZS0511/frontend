import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContactState } from '../reducer/contact.reducer'; 

export const selectContactState = createFeatureSelector<ContactState>('contact');

export const selectContactDetails = createSelector(
  selectContactState,
  (state: ContactState) => state.contactDetails
);

export const selectContactError = createSelector(
  selectContactState,
  (state: ContactState) => state.error
);
