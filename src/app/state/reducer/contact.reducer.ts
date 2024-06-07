import { createReducer, on } from '@ngrx/store';
import * as ContactActions from '../actions/contact.actions'; 

export interface ContactState {
  contactDetails: any | null;
  error: any | null;
}

export const initialState: ContactState = {
  contactDetails: null,
  error: null
};

export const contactReducer = createReducer(
  initialState,
  on(ContactActions.loadContactInformationSuccess, (state, { contactDetails }) => ({
    ...state,
    contactDetails,
    error: null
  })),
  on(ContactActions.loadContactInformationFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
