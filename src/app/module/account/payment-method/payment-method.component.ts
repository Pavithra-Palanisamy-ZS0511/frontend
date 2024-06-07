import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';


@Component({
    selector       : 'account-payment-method',
    templateUrl    : './payment-method.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [],
})
export class AccountPaymentMethodComponent 
{
    
}
