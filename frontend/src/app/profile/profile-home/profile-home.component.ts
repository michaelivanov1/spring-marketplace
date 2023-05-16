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
  profile?: Observable<Profile>;
  msg: string;
  userProfile: Profile;
  constructor(private profileService: ProfileService) {
    this.msg = '';
    this.userProfile = {
      id: {
        date: '',
        timestamp: '',
      },
      accountName: '',
      profileName: '',
      email: '',
      phoneNumber: '',
      profileImageURI: '',
      profileBannerURI: '',
    };
  }

  ngOnInit(): void {
    (this.profile = this.profileService.getOne('642794e00626870d47168e69')),
      catchError((err) => (this.msg = err.message));
    this.profile.forEach((x) => {
      console.log(x);
      this.userProfile = {
        id: {
          date: x.id.date,
          timestamp: x.id.timestamp,
        },
        accountName: x.accountName,
        profileName: x.profileName,
        email: x.email,
        phoneNumber: x.phoneNumber,
        profileImageURI: x.profileImageURI,
        profileBannerURI: x.profileBannerURI,
      };
    });
    //console.log(this.profile);
  }
}
