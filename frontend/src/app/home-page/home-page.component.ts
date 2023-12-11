import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  scrollToInfo() {
    const infoImageContainer = document.getElementById('learn-more-container');
    if (infoImageContainer) {
      infoImageContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
