import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/profile';
import { Observable } from 'rxjs';
import { BASEURL } from '@app/constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from '@app/shared.service';

@Component({
  selector: 'app-farmers-list',
  templateUrl: './farmers-list.component.html',
  styleUrls: ['./farmers-list.component.scss']
})
export class FarmersListComponent implements OnInit {

  profile: Observable<Profile[]> | undefined;
  profiles: Profile[] = [];

  profileImages: any = [];

  constructor(
    private profileService: ProfileService,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) { }


  ngOnInit(): void {
    this.profile = this.profileService.get();
  }

  navigateToFarmersProfile(profile: Profile) {
    this.sharedService.setUserEmail(profile.email);

    this.router.navigate(['farmers-profile']);
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

}