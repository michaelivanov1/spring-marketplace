import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidateEmail } from '../validators/email.validator';
import { ValidateDisplayName } from '../validators/displayname.validator';
import { ValidatePassword } from '../validators/password.validator';
import { Router } from '@angular/router';
import { AuthService } from '../authService';

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
  hidePassword = true;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
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
        '',
        Validators.compose([Validators.required, ValidatePassword])
      )),
      (this.registrationForm = new FormGroup({
        displayName: this.displayName,
        email: this.email,
        password: this.password,
      }));
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
      },
      (error: any) => {
        this.loading = false;
        console.error('not added to db: ', error);
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
