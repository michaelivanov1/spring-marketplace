import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/profile';
import { Observable } from 'rxjs';
import { BASEURL } from '@app/constants';
import { HttpClient } from '@angular/common/http';

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

    //   this.profile.subscribe((data: Profile[]) => {
    //     this.profiles = data;

    //     data.forEach((p) => {
    //       if (p.profileImage) {
    //         // Fetch profile images and store them in the profileImages object
    //         this.fetchProfileImage(p.profileImage).subscribe((imageData: Blob) => {
    //           this.profileImages[p.id] = imageData;
    //         });
    //       }
    //     });
    //   });
    // }

    // private fetchProfileImage(imageUrl: string): Observable<Blob> {
    //   const headers = new HttpHeaders().set(
    //     'Authorization',
    //     `Bearer ${localStorage.getItem('jwtToken')}`
    //   );
    //   return this.http.get(imageUrl, { headers, responseType: 'blob' });
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
