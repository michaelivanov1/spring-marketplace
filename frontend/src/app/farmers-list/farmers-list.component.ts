import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/profile';
import { Observable } from 'rxjs';
import { BASEURL } from '@app/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from '@app/shared.service';
import { UserStand } from '@app/user-stand/user-stand';
import { UserStandService } from '@app/user-stand/user-stand.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-farmers-list',
  templateUrl: './farmers-list.component.html',
  styleUrls: ['./farmers-list.component.scss']
})
export class FarmersListComponent implements OnInit {

  profile: Observable<Profile[]> | undefined;
  profiles: Profile[] = [];
  creationDateFormatted!: Date;
  profileImages: any = [];
  decodedToken: any;
  loggedInUser: any;

  constructor(
    private profileService: ProfileService,
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService,
    private userStandService: UserStandService
  ) { }


  ngOnInit(): void {

    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');
    this.profileService.getOne(this.decodedToken.sub);
    this.loggedInUser = this.decodedToken.sub;

    this.profileService.get().subscribe(
      (profiles) => {
        this.profiles = profiles;
        this.fetchProfileImages();

        // grab each profile's produceList size. used to display # of listings
        for (let i = 0; i < this.profiles.length; i++) {
          this.profiles[i].produceListSize = 0;

          this.userStandService.getOne(this.profiles[i].email).subscribe(
            (userStands) => {
              this.profiles[i].produceListSize! += userStands.produceList.length;
            }
          )
        }
        console.log(this.profiles.map((p) => p.produceListSize))
      }
    );
  }

  fetchProfileImages() {
    this.profiles.forEach((profile) => {
      if (profile.profileImage) {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${localStorage.getItem('jwtToken')}`
        );

        this.http.get(`${BASEURL}file/${profile.profileImage}`, {
          headers,
          responseType: 'blob',
        })
          .subscribe((data: any) => {
            const reader = new FileReader();
            reader.onload = () => {
              profile.profileImage = reader.result as string;
            };
            reader.readAsDataURL(data);
          });
      }
    });
  }

  navigateToFarmersProfile(profile: Profile) {
    this.sharedService.setUserEmail(profile.email);

    this.router.navigate(['farmers-profile']);
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

}