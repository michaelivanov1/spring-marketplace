import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})

export class DBTest {

  text: String | undefined;

  constructor(private http: HttpClient) { }

  handleClick() {
    const body = { text: this.text };
    this.http.post('http://localhost:8080/api/test', body, { responseType: 'text' })
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error('not added to db: ', error);
      });
  }
}