import { AbstractControl } from '@angular/forms';

export function ValidateDisplayName(control: AbstractControl): { invalidDisplayname: boolean } | null {
    const MIN_LENGTH = 4;
    return control.value && control.value.length < MIN_LENGTH ? { invalidDisplayname: true } : null;
}