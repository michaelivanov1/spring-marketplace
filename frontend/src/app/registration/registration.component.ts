import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateEmail } from '../validators/email.validator';
import { ValidateUsername } from '../validators/username.validator';
import { ValidatePassword } from '../validators/password.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent {

  registrationForm: FormGroup;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  hidePassword = true;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.username = new FormControl('', Validators.compose([Validators.required, ValidateUsername])),
      this.email = new FormControl('', Validators.compose([Validators.required, ValidateEmail])),
      this.password = new FormControl('', Validators.compose([Validators.required, ValidatePassword])),
      this.registrationForm = new FormGroup({
        username: this.username,
        email: this.email,
        password: this.password,
      })
  }

  // registrationForm = new FormGroup({
  //   username: new FormControl(''),
  //   email: new FormControl('', Validators.compose([Validators.required, ValidateEmail])),
  //   password: new FormControl(''),
  // });


  // registrationForm = this.formBuilder.group({
  //   username: '',
  //   email: '',
  //   password: ''
  // });

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