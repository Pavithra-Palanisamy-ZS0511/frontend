import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import * as ContactActions from '../actions/contact.actions';

@Injectable()
export class ContactEffects {

  loadContactInformation$ = createEffect(() => this.actions$.pipe(
    ofType(ContactActions.loadContactInformation),
    mergeMap(action =>
      this.authService.contactInformation(action.email).pipe(
        tap(response => {
            console.log('Response:', response); 
          }),
        map(response => {
          const contactDetails = response.data;
          return ContactActions.loadContactInformationSuccess({ contactDetails });
        }),
        catchError(error => {
            console.error('Error:', error); 
            return of(ContactActions.loadContactInformationFailure({ error }));
          })
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
