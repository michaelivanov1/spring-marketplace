import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent {

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  registrationForm = this.formBuilder.group({
    username: '',
    email: '',
    password: ''
  });

  onFormSubmit() {
    const body = {
      username: this.registrationForm.value.username,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password
    };

    this.http.post('http://localhost:8080/api/registration', body, { responseType: 'text' })
      .subscribe((response: any) => {
        console.log(response);
      }, (error: any) => {
        console.error('not added to db: ', error);
      });
  }

}