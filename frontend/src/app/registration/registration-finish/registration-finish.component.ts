import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-finish',
  templateUrl: './registration-finish.component.html',
  styleUrls: ['./registration-finish.component.scss']
})
export class RegistrationFinishComponent implements OnInit {

  constructor(private router: Router) { }

  onMarketplaceClick() {
    this.router.navigate(['/marketplace']);
  }

  onFinishRegistrationClick() {
    this.router.navigate(['/profile'])
  }

  ngOnInit(): void {
  }

}
