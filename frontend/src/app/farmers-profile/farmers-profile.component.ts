import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared.service';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/profile';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartitemDialogComponent } from '../dialogs/cartitem-dialog/cartitem-dialog.component';
import { BASEURL } from '@app/constants';
import { UserStand } from '@app/user-stand/user-stand';
import { UserStandService } from '@app/user-stand/user-stand.service';
import { Produce } from '@app/common-interfaces/produce';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-farmers-profile',
  templateUrl: './farmers-profile.component.html',
  styleUrls: ['./farmers-profile.component.scss']
})
export class FarmersProfileComponent implements OnInit {

  email!: String;
  profile?: Profile;
  dateCreatedFormatted: string;
  imageSrc: string;
  profileImageLoaded: Boolean = false;
  // userProfile: Profile;
  userStand: UserStand;
  // userStandService: UserStandService;
  userStandDataExists: boolean;
  isHovered: boolean;
  hoveredProduce: any = null;
  rawProduceImg: string[];

  constructor(private sharedService: SharedService, private profileService: ProfileService, private http: HttpClient, private userStandService: UserStandService, private dialog: MatDialog) {
    this.dateCreatedFormatted = '';
    this.imageSrc = '';
    this.userStandDataExists = false;
    this.isHovered = false;
    this.rawProduceImg = [];

    this.userStand = {
      id: {
        date: '',
        timestamp: '',
      },
      email: '',
      displayName: '',
      produceList: [],
    };
  }

  ngOnInit(): void {

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );

    this.email = this.sharedService.getUserEmail() || '';
    console.log(this.email)

    this.profileImageLoaded = false;
    this.imageSrc = '../../../assets/profile-image-loading.gif';

    this.profileService.getOne(this.email).subscribe(
      (profile) => {
        console.log('Profile Data:', profile);

        if (profile) {
          this.profile = profile;
          const ESTDate = this.convertToEST(this.profile.creationDate);
          const year = ESTDate.substr(0, 4);
          const month = ESTDate.substr(5, 2);
          const day = ESTDate.substr(8, 2);
          const formattedDate = `${year}-${month}-${day}`;
          this.dateCreatedFormatted = formattedDate;
        } else {
          console.error('Profile is null.');
        }
      },
      (error) => {
        console.error('Error fetching profile:', error);
      }
    );

    this.profileService
      .getOne(this.email)
      .pipe(
        switchMap((profile) => {
          if (profile.profileImage === '') {
            this.imageSrc =
              '../../../assets/default-avatar.png';
            this.profileImageLoaded = true;
            return of(null); // return an observable to stop the chain
          }

          // make the second API call
          return this.http.get(`${BASEURL}file/${profile.profileImage}`, {
            headers,
            responseType: 'blob', // set the responseType to 'blob' for binary data
          });
        }),

        catchError((error) => {
          console.error('Error:', error);
          return of(null);
        }),

        tap((data: any) => {
          if (data) {
            this.profileImageLoaded = true;
            const reader = new FileReader();
            reader.onload = () => {
              this.imageSrc = reader.result as string;
            };
            reader.readAsDataURL(data);
          }
        })
      )
      .subscribe();

    // user's listings
    this.userStandService
      .getOne(this.email)
      .pipe(
        catchError((err) => {
          // this.msg = err.message;
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.userStand = data;
          if (this.userStand.produceList.length > 0)
            this.userStandDataExists = true;

          // loop through and api call the images
          // Initialize an array to keep track of the order
          const requests = data.produceList.map((e) =>
            this.http.get(`${BASEURL}file/${e.produceImage}`, {
              headers,
              responseType: 'blob',
            })
          );
          forkJoin(requests)
            .pipe(
              catchError((err) => {
                // this.msg = err.message;
                return of([]);
              })
            )
            .subscribe((responses: any[]) => {
              responses.forEach((imageData: any, index) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const currentImage = reader.result as string;
                  this.rawProduceImg[index] = currentImage;
                };
                reader.readAsDataURL(imageData);
              });
            });
        }
      });
  }

  onProductClick(user: UserStand, produce: any, rawPicture: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.height = '50vh';
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      user: user,
      produce: produce,
      rawPicture: rawPicture,
    };
    dialogConfig.panelClass = 'customdialog';
    const dialogRef = this.dialog.open(CartitemDialogComponent, dialogConfig);
  }

  convertToEST(dateString: any): string {
    const utcDate = new Date(dateString);
    const estOffset = -4 * 60; // EST is UTC-4

    utcDate.setMinutes(utcDate.getMinutes() + estOffset); // Adjust minutes for EST

    const isoString = utcDate.toISOString(); // Convert back to ISO string

    return isoString;
  }

  // cursor / pointer
  onHover(produce: Produce): void {
    this.isHovered = true;
    this.hoveredProduce = produce;
  }

  // cursor / pointer
  onLeave(): void {
    this.isHovered = false;
    this.hoveredProduce = null;
  }

  // cursor / pointer
  getCursor(): string {
    return this.isHovered ? 'pointer' : 'default';
  }
}