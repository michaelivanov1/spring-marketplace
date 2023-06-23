import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Profile } from '@app/profile/profile';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
  providedIn: 'root',
})
export class ProfileService extends GenericHttpService<Profile> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `user`);
  } // constructor
} // ProfileService
