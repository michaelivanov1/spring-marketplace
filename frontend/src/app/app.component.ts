import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-marketplace',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title: string = '';
  constructor(private router: Router) {
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
}
