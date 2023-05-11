import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile.service';
import { Profile } from '../profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile?: Observable<Profile[]>;
  msg: string;

  constructor(private profileService: ProfileService) {
    this.msg = '';
  }

  ngOnInit(): void {
    // (this.profile = this.profileService.getSome('642794e00626870d47168e69')),
    //   catchError((err) => (this.msg = err.message));
    // console.log(this.profile.subscribe());
  }
}
