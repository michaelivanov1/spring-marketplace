import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { UserStand } from '../user-stand/user-stand';
import { UserStandService } from '../user-stand/user-stand.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASEURL } from '@app/constants';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  userStand?: Observable<UserStand[]>;
  userStandProfiles: UserStand[] = [];
  rawPicturesPerProfiles: string[][];
  guestToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaWNoYWVsQGdtYWlsLmNvbSIsImlhdCI6MTY5Nzk0NDczNSwiZXhwIjoyNDQ1MDQwNDE4ODMzNDQwfQ.AnvCqIvLtKGoN5QUnj-sF-nNVdN8p0UNhGrU8f_HVW8';

  constructor(
    private userStandService: UserStandService,
    private http: HttpClient
  ) {
    this.rawPicturesPerProfiles = [['']];
  }

  ngOnInit(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.guestToken}`
    );

    this.userStand = this.userStandService.getGuestToken(this.guestToken);
    this.userStand.subscribe((users: UserStand[]) => {
      this.userStandProfiles = users.filter(
        (user) => user.produceList && user.produceList.length > 0
      );
      console.log(this.userStandProfiles);

      this.userStandProfiles.forEach((profile, i) => {
        this.rawPicturesPerProfiles[i] = [];
        const requests = profile.produceList.map((e) => {
          return this.http.get(`${BASEURL}file/${e.produceImage}`, {
            responseType: 'blob',
            headers,
          });
        });

        forkJoin(requests)
          .pipe(
            catchError((err) => {
              return of([]);
            })
          )
          .subscribe((responses: any[]) => {
            responses.forEach((imageData: Blob, j) => {
              this.rawPicturesPerProfiles[i][j] = '';
              const reader = new FileReader();
              reader.onload = () => {
                const currentImage = reader.result as string;
                this.rawPicturesPerProfiles[i][j] = currentImage;
              };
              reader.readAsDataURL(imageData);
            });
          });
      });
    });
  }

  scrollToInfo() {
    const infoImageContainer = document.getElementById('learn-more-container');
    if (infoImageContainer) {
      infoImageContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
