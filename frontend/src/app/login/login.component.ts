import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidateUsername } from '../validators/username.validator';
import { ValidatePassword } from '../validators/password.validator';
import { Router } from '@angular/router';
import {ValidateEmail} from "@app/validators/email.validator";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    (this.email = new FormControl('', Validators.compose([Validators.required, ValidateEmail]))),

      (this.password = new FormControl('', Validators.compose([Validators.required, ValidatePassword]))),

      (this.loginForm = new FormGroup({
        email: this.email, password: this.password,
      }
      ));
  }

  onFormSubmit() {
    const body = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.http
      .post('http://localhost:8080/api/auth/authenticate', body, {
        responseType: 'json'
      })
      .subscribe((response: any) => {
        console.log(response.token);
        sessionStorage.setItem('jwtToken', response.token);

        this.navigateToComponent();

        //TODO: for frontend crew:  let user know when login failed (getting back 403 forbidden)
      });

    // this.http
    //   .post('http://localhost:8080/api/login', body, {
    //     responseType: 'text',
    //   })
    //   .subscribe(
    //     (response: any) => {
    //       console.log(response);
    //     },
    //   );
  }

  navigateToComponent() {
    this.router.navigate(['/marketplace']);
  }
}

