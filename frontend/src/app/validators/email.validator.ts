import { AbstractControl } from '@angular/forms';

export function ValidateEmail(control: AbstractControl): { invalidEmail: boolean } | null {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !EMAIL_REGEXP.test(control.value) ? { invalidEmail: true } : null;
}