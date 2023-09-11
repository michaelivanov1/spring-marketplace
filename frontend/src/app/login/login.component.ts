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
import { SnackbarComponent } from "@app/snackbar/snackbar.component";

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
    private snackbarService: SnackbarComponent,
  ) {
    (this.email = new FormControl('', Validators.compose([Validators.required, ValidateEmail]))),

      (this.password = new FormControl('', Validators.compose([Validators.required, ValidatePassword]))),

      (this.loginForm = new FormGroup({
        email: this.email, password: this.password,
      }
      ));
  }

  ngOnInit() {
    // if they re-open the page as logged in, send them to profile instead of login component
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  onFormSubmit() {
    const { email, password } = this.loginForm.value;

    this.loading = true;

    this.authService.login(email, password).subscribe(
      () => {
        this.navigateToProfile();
        this.loginFailed = false;
        this.snackbarService.open('Successfully Logged In!');
      },
      (error: any) => {
        setTimeout(() => {
          this.loginFailed = false;
        }, 2500);
        this.loginFailed = true;
        this.loading = false;

        console.error('Login failed:', error);
        this.snackbarService.open('Login Failed. Please try again');
      },
      () => {
        this.loading = false;
      }
    );
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
