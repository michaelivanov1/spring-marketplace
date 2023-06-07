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
  farmerStand?: Observable<FarmerStand>;
  msg: string;
  userProfile: Profile;
  userStand: FarmerStand;
  isHovered: boolean;
  selectedProduct: any;
  constructor(
    private profileService: ProfileService,
    private farmerStandService: FarmerStandService
  ) {
    this.msg = '';
    this.isHovered = false;
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
      profileName: '',
      accountName: '',
      produceList: [],
    };
    this.selectedProduct = '';
  }

  ngOnInit(): void {
    (this.profile = this.profileService.getOne('642794e00626870d47168e69')),
      catchError((err) => (this.msg = err.message));
    this.profile.forEach((x) => {
      this.userProfile = x;
    });
    (this.farmerStand = this.farmerStandService.getOne('johndoe')),
      catchError((err) => (this.msg = err.message));
    this.farmerStand.forEach((y) => {
      this.userStand = y;
      console.log(y);
    });
  }
  onProductClick(farmer: FarmerStand, product: any) {
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
