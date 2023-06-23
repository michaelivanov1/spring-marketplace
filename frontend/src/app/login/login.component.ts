import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidatePassword } from '../validators/password.validator';
import { Router } from '@angular/router';
import { ValidateEmail } from "@app/validators/email.validator";
import { AuthService } from '../authService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  decodedToken: any;
  invalidLoginText: string = 'Invalid credentials. Please try again';
  loginFailed: Boolean = false;
  hidePassword = true;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    (this.email = new FormControl('', Validators.compose([Validators.required, ValidateEmail]))),

      (this.password = new FormControl('', Validators.compose([Validators.required, ValidatePassword]))),

      (this.loginForm = new FormGroup({
        email: this.email, password: this.password,
      }
      ));
  }

  onFormSubmit() {
    const { email, password } = this.loginForm.value;

    this.loading = true;

    this.authService.login(email, password).subscribe(
      () => {
        this.navigateToMarketplace();
        this.loginFailed = false;
      },
      (error: any) => {
        setTimeout(() => {
          this.loginFailed = false;
        }, 2500);
        this.loginFailed = true;
        this.loading = false;
        console.error('Login failed:', error);
      },
      () => {
        this.loading = false; 
      }
    );
  }

  navigateToMarketplace() {
    this.router.navigate(['/marketplace']);
  }
}