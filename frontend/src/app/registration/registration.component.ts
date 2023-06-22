import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidateEmail } from '../validators/email.validator';
import { ValidateUsername } from '../validators/username.validator';
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
  username: FormControl;
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
    (this.username = new FormControl(
      '',
      Validators.compose([Validators.required, ValidateUsername])
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
        username: this.username,
        email: this.email,
        password: this.password,
      }));
  }

  onFormSubmit() {
    this.loading = true;

    const username = this.registrationForm.value.username;
    const email = this.registrationForm.value.email;
    const password = this.registrationForm.value.password;

    this.authService.register(username, email, password)
      .subscribe(
        (response: any) => {
          console.log(response);
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
