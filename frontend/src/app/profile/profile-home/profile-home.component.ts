import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile.service';
import { Profile } from '../profile';
import { UserStandService } from '@app/user-stand/user-stand.service';
import { UserStand } from '@app/user-stand/user-stand';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile?: Observable<Profile>;
  subscriberStand?: Observable<UserStand>;
  msg: string;
  userProfile: Profile;
  userStand: UserStand;
  isHovered: boolean;
  selectedProduct: any;
  decodedToken: any;
  constructor(
    private profileService: ProfileService,
    private userStandService: UserStandService
  ) {
    this.msg = '';
    this.isHovered = false;
    this.userProfile = {
      id: {
        date: '',
        timestamp: '',
      },
      displayName: '',
      description: '',
      email: '',
      phoneNumber: '',
      profileImage: '',
      bannerImage: '',
      creationDate: '',
    };
    this.userStand = {
      id: {
        date: '',
        timestamp: '',
      },
      displayName: '',
      produceList: [],
    };
    this.selectedProduct = '';
  }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');
    console.log(this.decodedToken);
    (this.profile = this.profileService.getOne(this.decodedToken.sub)),
      catchError((err) => (this.msg = err.message));
    this.profile.forEach((x) => {
      console.log(this.userProfile);
      this.userProfile = x;
    });
    (this.subscriberStand = this.userStandService.getOne(this.decodedToken)),
      catchError((err) => (this.msg = err.message));
    this.subscriberStand.forEach((y) => {
      this.userStand = y;
      console.log(y);
    });
  }

  onProductClick(user: UserStand, product: any) {
    console.log(`clicked on: ${product.name}`);
    return this.selectedProduct === product
      ? (this.selectedProduct = null)
      : (this.selectedProduct = product);
  }

  // change cursor on hover
  onHover() {
    this.isHovered = true;
  }
  onLeave() {
    this.isHovered = false;
  }
  getCursor(): string {
    return this.isHovered ? 'pointer' : 'default';
  }
}
