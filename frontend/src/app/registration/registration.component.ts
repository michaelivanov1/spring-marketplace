import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidateEmail } from '../validators/email.validator';
import { ValidateDisplayName } from '../validators/displayname.validator';
import {MatchPassword, ValidatePassword} from '../validators/password.validator';
import { Router } from '@angular/router';
import { AuthService } from '../authService';
import { SnackbarComponent } from "@app/snackbar/snackbar.component";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})

export class RegistrationComponent {
  registrationForm: FormGroup;
  displayName: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
  hidePassword = true;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarComponent,
  ) {
    (this.displayName = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateDisplayName])
    )),
      (this.email = new FormControl(
        '',
        Validators.compose([Validators.required, ValidateEmail])
      )),
      (this.password = new FormControl(
        ''
      )),
      (this.passwordConfirm = new FormControl(
        ''
      )),
      (this.registrationForm = new FormGroup({
        displayName: this.displayName,
        email: this.email,
        password: this.password,
        passwordConfirm: this.passwordConfirm
      }));

    this.password.setValidators([Validators.required, ValidatePassword, MatchPassword(this.passwordConfirm)])
    this.passwordConfirm.setValidators([Validators.required, ValidatePassword, MatchPassword(this.password)])

    this.password.valueChanges.subscribe(() => {
      this.passwordConfirm.updateValueAndValidity();
    });

    this.passwordConfirm.valueChanges.subscribe(() => {
      this.password.updateValueAndValidity();
    });

  }

  onFormSubmit() {
    this.loading = true;

    const displayName = this.registrationForm.value.displayName;
    const email = this.registrationForm.value.email;
    const password = this.registrationForm.value.password;

    this.authService.register(displayName, email, password).subscribe(
      (response: any) => {
        sessionStorage.setItem('jwtToken', response.token);
        this.navigateToComponent();
        this.snackbarService.open('Successfully Registered New Account');
      },
      (error: any) => {
        this.loading = false;
        console.error('not added to db: ', error);
        this.snackbarService.open('Something Went Wrong: Failed To Register New Account');
      },
      () => {
        this.loading = false;
      }
    );
  }

  navigateToComponent() {
    this.router.navigate(['/registration-finish']);
  }

  handleAlreadyRegistered() {
    this.router.navigate(['/login']);
  }
}
