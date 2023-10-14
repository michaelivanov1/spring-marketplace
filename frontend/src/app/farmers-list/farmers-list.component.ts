import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/profile';
import { Observable, forkJoin } from 'rxjs';
import { BASEURL } from '@app/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    private http: HttpClient
  ) { }



  ngOnInit(): void {

    this.profile = this.profileService.get();


    // this.profile.subscribe((data: Profile[]) => {
    //   this.profiles = data;

    //   this.profileImages = [];

    //   data.forEach((p) => {
    //     if (p.profileImage) {
    //       this.profileImages.push(p.profileImage);
    //     }
    //   });


    // const headers = new HttpHeaders().set(
    //   'Authorization',
    //   `Bearer ${localStorage.getItem('jwtToken')}`
    // );

    // this.http.get(`http://localhost:8080/api/file/120ddac6-afa8-44c0-a69e-6879fa2f51e0}`, { headers, responseType: 'blob' })
    //   .subscribe((data) => {
    //     this.profileImages = data;
    //   });
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
