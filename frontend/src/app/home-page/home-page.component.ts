import { Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { UserStand } from '../user-stand/user-stand';
import { UserStandService } from '../user-stand/user-stand.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASEURL, GUESTTOKEN } from '@app/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})

export class HomePageComponent implements OnInit {
  userStand?: Observable<UserStand[]>;
  userStandProfiles: UserStand[] = [];
  produceList: any;

  constructor(
    private userStandService: UserStandService,
    private http: HttpClient,
    private router: Router
  ) {}


  ngOnInit(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${GUESTTOKEN}`
    );

    this.userStandService.getSpecificProduceQty(10, GUESTTOKEN).subscribe((produceObject) => {
      // create a produce array instead of an object
      const produceArray = Object.values(produceObject);

      // create a produceList object based on produceArray, this time populating only the fields necessary
      this.produceList = produceArray.map((p: any) => ({
        foodName: p.foodName,
        qoh: p.qoh,
        harvestDate: p.harvestDate,
        price: p.price,
        produceImage: p.produceImage
      }));

      // create an array to store all the image get requests
      const imageRequests: Observable<Blob>[] = this.produceList.map((produce: any) => {
        return this.http.get(`${BASEURL}file/${produce.produceImage}`, {
          responseType: 'blob',
          headers,
        });
      });

      // forkJoin to wait for all image requests to complete
      forkJoin(imageRequests).subscribe({
        next: (responses: Blob[]) => {
          responses.forEach((imageData: Blob, index: number) => {
            const reader = new FileReader();
            reader.onload = () => {
              const currentImage = reader.result as string;
              // assign the fetched image to the corresponding produce item
              this.produceList[index].image = currentImage;
            };
            reader.readAsDataURL(imageData);
          });
        },
        error: (error: any) => {
          console.error('Error fetching images:', error);
        }
      });
    });
  }

  scrollToInfo() {
    const infoImageContainer = document.getElementById('featured-produce');
    if (infoImageContainer) {
      infoImageContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  redirectToRegistration() {
    this.router.navigate(['/register']);
  }

  // eventually redirect to about component
  learnMoreClick() {
    this.router.navigate(['about']);
  }
}
