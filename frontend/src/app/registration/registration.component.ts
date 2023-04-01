import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent {

  constructor(private formBuilder: FormBuilder) { }

  registrationForm = this.formBuilder.group({
    username: '',
    email: '',
    password: ''
  });

  onFormSubmit() {
    console.log(`form data: ${JSON.stringify(this.registrationForm.value)}`);
  }

}