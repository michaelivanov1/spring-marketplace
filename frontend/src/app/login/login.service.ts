import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserVerification } from '@app/common-interfaces/user-verification';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
  providedIn: 'root',
})
export class LoginService extends GenericHttpService<UserVerification> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `auth/register`);
  } // constructor
} // LoginService
