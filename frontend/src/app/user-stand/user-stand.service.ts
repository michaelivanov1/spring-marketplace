import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStand } from '@app/user-stand/user-stand';
import { GenericHttpService } from '@app/generic-http.service';

@Injectable({
  providedIn: 'root',
})

export class UserStandService extends GenericHttpService<UserStand> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `user_stand`);
  } // constructor
} // UserStandService
