import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { MonthlyCommitmentService } from "app/core/services/monthly-commitment.service";
import * as MonthlyCommitmentAction from "../actions/monthly-commitment.actions";
import { ERROR_MESSAGE } from "app/core/utils/constant/ErrorConstants";

@Injectable()
export class MonthlyCommitmentEffects {
  errorMessage = ERROR_MESSAGE;
  loadMonthlyCommitment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MonthlyCommitmentAction.loadMonthlyCommitment),
      mergeMap(() =>
        this.monthlyCommitmentService.getMonthlyCommitmentDetails().pipe(
          map((response: any) => {
            if (response && response.isSuccess && response.data) {
              const monthlyCommitmentDetails = JSON.parse(response.data);
              return MonthlyCommitmentAction.loadMonthlyCommitmentSuccess({
                monthlyCommitmentDetails,
              });
            } else {
              const error = { message: this.errorMessage.internalServerError };
              return MonthlyCommitmentAction.loadMonthlyCommitmentFailure({ error });
            }
          }),
          catchError((error: any) =>
            of(MonthlyCommitmentAction.loadMonthlyCommitmentFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private monthlyCommitmentService: MonthlyCommitmentService
  ) {}
}