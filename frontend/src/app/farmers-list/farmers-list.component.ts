import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/profile';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-farmers-list',
  templateUrl: './farmers-list.component.html',
  styleUrls: ['./farmers-list.component.scss']
})
export class FarmersListComponent implements OnInit {

  profile$: Observable<Profile[]> | undefined;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profile$ = this.profileService.get();
  }

}
