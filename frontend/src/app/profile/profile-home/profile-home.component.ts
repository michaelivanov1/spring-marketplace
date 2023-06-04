import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile.service';
import { Profile } from '../profile';
import { FarmerStandService } from '@app/farmer-stand/farmer-stand.service';
import { FarmerStand } from '@app/farmer-stand/farmer-stand';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile?: Observable<Profile>;
  farmerStand?: Observable<FarmerStand[]>;
  msg: string;
  userProfile: Profile;
  userStand: FarmerStand;
  constructor(
    private profileService: ProfileService,
    private farmerStandService: FarmerStandService
  ) {
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
    this.userStand = {
      id: {
        date: '',
        timestamp: '',
      },
      account: {
        id: {
          date: '',
          timestamp: '',
        },
        username: '',
        email: '',
        password: '',
      },
      produceList: [],
    };
  }

  ngOnInit(): void {
    (this.profile = this.profileService.getOne('642794e00626870d47168e69')),
      catchError((err) => (this.msg = err.message));
    this.profile.forEach((x) => {
      console.log(x);
      this.userProfile = x;
    });
    (this.farmerStand = this.farmerStandService.get()),
      catchError((err) => (this.msg = err.message));
    this.farmerStand.forEach((y) => {});
  }
}
