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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  username: FormControl;
  password: FormControl;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    (this.username = new FormControl('', Validators.compose([Validators.required, ValidateUsername]))),

      (this.password = new FormControl('', Validators.compose([Validators.required, ValidatePassword]))),

      (this.loginForm = new FormGroup({
        username: this.username, password: this.password,
      }
      ));
  }

  onFormSubmit() {
    const body = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

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
}

