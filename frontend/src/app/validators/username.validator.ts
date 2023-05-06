import { AbstractControl } from '@angular/forms';

export function ValidateUsername(control: AbstractControl): { invalidUsername: boolean } | null {
    const MIN_LENGTH = 4;
    return control.value && control.value.length < MIN_LENGTH ? { invalidUsername: true } : null;
}