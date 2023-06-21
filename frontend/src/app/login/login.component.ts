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
  hidePassword = true;

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

    this.authService.autoLogin(email, password).subscribe(
      () => {
        this.navigateToMarketplace();
      },
      (error: any) => {
        console.error('Login failed:', error);
      }
    );
  }

  navigateToMarketplace() {
    this.router.navigate(['/marketplace']);
  }
}