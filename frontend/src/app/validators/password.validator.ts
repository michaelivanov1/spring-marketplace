import { AbstractControl } from '@angular/forms';

export function ValidatePassword(control: AbstractControl): { invalidPassword: boolean } | null {
    const MIN_LENGTH = 4;
    return control.value && control.value.length < MIN_LENGTH ? { invalidPassword: true } : null;
}

export function MatchPassword(otherControl: AbstractControl) {
  return (control: AbstractControl): { matchedPassword: boolean } | null => {
    const isMatch = control.value === otherControl.value;
    return isMatch ? null : { matchedPassword: false };
  };
}
