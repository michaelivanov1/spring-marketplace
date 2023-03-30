import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})

export class DBTest {

  text: String | undefined;

  handleClick() {
    console.log('text:', this.text);
    // db
  }

}
