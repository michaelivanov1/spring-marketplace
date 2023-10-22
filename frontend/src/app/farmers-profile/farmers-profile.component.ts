import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared.service';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/profile';

@Component({
  selector: 'app-farmers-profile',
  templateUrl: './farmers-profile.component.html',
  styleUrls: ['./farmers-profile.component.scss']
})
export class FarmersProfileComponent implements OnInit {

  email!: String;
  profile?: Profile;

  constructor(private sharedService: SharedService, private profileService: ProfileService,) { }

  ngOnInit(): void {
    this.email = this.sharedService.getUserEmail();

    console.log(`email from shared-service: ${this.email}`);

    // TODO: api call to grab all users data based on email
    // http://localhost:8080/api/user/email@gmail.com
    this.profileService.getOne(this.email).subscribe(
      (profile) => {
        this.profile = profile;
      },
      (error) => {
        console.error('Error fetching profile:', error);
      }
    );
  }
}