import { AbstractControl } from '@angular/forms';

export function ValidatePassword(control: AbstractControl): { invalidPassword: boolean } | null {
    const MIN_LENGTH = 4;
    return control.value && control.value.length < MIN_LENGTH ? { invalidPassword: true } : null;
}