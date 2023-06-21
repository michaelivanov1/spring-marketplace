import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authService';

@Component({
  selector: 'app-marketplace',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title: string = '';
  showLoginRegisterButtons: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
    // if they refresh the page and setTitle doesn't run we'll grab the window path
    this.title === ''
      ? this.setTitle(
        window.location.pathname.substring(1, window.location.pathname.length)
      )
      : null;
  }

  setTitle(title: string) {
    this.title = title;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}