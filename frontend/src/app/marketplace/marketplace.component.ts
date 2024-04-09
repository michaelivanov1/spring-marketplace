import { Component } from '@angular/core';
import { UserStandService } from '../user-stand/user-stand.service';
import { UserStand } from '../user-stand/user-stand';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartitemDialogComponent } from '../dialogs/cartitem-dialog/cartitem-dialog.component';
import jwt_decode from 'jwt-decode';
import { ProfileService } from '@app/profile/profile.service';
import { SnackbarComponent } from '@app/snackbar/snackbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BASEURL } from '@app/constants';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent {
  selectedProduct: any;
  userStand?: Observable<UserStand[]>;
  userStandProfiles: UserStand[] = [];
  filteredUserStands: UserStand[] = [];
  rawPicturesPerProfiles: string[][];
  filteredRawPicturesPerProfiles: string[][] = [];
  decodedToken: any;
  loggedInUser: any;
  totalCount: Number | undefined;
  searchTerm: string = '';

  constructor(
    private userStandService: UserStandService,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private snackbarService: SnackbarComponent,
    private router: Router,
    private http: HttpClient
  ) {
    this.rawPicturesPerProfiles = [['']];
    this.filteredRawPicturesPerProfiles = [['']];
  }

  ngOnInit(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');
    this.profileService.getOne(this.decodedToken.sub);
    this.loggedInUser = this.decodedToken.sub;
    this.snackbarService.open('Loading All Available Produce..');
    this.userStand = this.userStandService.get();
    this.userStand?.subscribe((users: UserStand[]) => {
      this.userStandProfiles = users.filter(
        (user) => user.produceList && user.produceList.length > 0
      );
      this.filteredUserStands = this.userStandProfiles;
      // get count of items on marketplace
      this.totalCount = this.userStandProfiles.reduce((count, user) => {
        return count + user.produceList.length;
      }, 0);

      this.userStandProfiles.forEach((profile, i) => {
        this.rawPicturesPerProfiles[i] = [];
        this.filteredRawPicturesPerProfiles[i] = [];
        const requests = profile.produceList.map((e) =>
          this.http.get(`${BASEURL}file/${e.produceImage}`, {
            headers,
            responseType: 'blob',
          })
        );
        forkJoin(requests)
          .pipe(
            catchError((err) => {
              return of([]);
            })
          )
          .subscribe((responses: any[]) => {
            responses.forEach((imageData: Blob, j) => {
              this.rawPicturesPerProfiles[i][j] = '';
              this.filteredRawPicturesPerProfiles[i][j] = '';
              const reader = new FileReader();
              reader.onload = () => {
                const currentImage = reader.result as string;
                this.rawPicturesPerProfiles[i][j] = currentImage;
                this.filteredRawPicturesPerProfiles[i][j] = currentImage;
              };
              reader.readAsDataURL(imageData);
            });
          });
      });
      this.snackbarService.open('Loaded All Available Produce');
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

  onHover() {
    this.selectedProduct = true;
  }

  onLeave() {
    this.selectedProduct = false;
  }

  getCursor(): string {
    return this.selectedProduct ? 'pointer' : 'default';
  }

  profileRedirect() {
    this.router.navigate(['/profile']);
  }

  // Helper Functions
  useRegex(input: any): boolean {
    let regex =
      /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/i;
    return regex.test(input);
  }

  performSearch() {
    if (!this.searchTerm.trim()) {
      // If search term is empty, reset to default and return
      this.filteredUserStands = [...this.userStandProfiles];
      this.filteredRawPicturesPerProfiles = [...this.rawPicturesPerProfiles];
      return;
    }
    this.filteredRawPicturesPerProfiles = [[]];

    // Filter user stands based on produce names matching search term
    this.filteredUserStands = this.userStandProfiles.map((userStand, i) => {
      // Filter produce within each user stand to only include those that match the search term
      const filteredProduces = userStand.produceList.filter((produce, j) => {
        if (
          produce.foodName.toLowerCase().includes(this.searchTerm.toLowerCase())
        ) {
          const produceNameMatches = produce.foodName;
          this.filteredRawPicturesPerProfiles[i].push(
            this.rawPicturesPerProfiles[i][j]
          );
        }
        const produceNameMatches = produce.foodName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
        return produceNameMatches;
      });
      // Create a new user stand object with filtered produces
      this.filteredRawPicturesPerProfiles.push([]);
      return {
        id: userStand.id,
        email: userStand.email,
        displayName: userStand.displayName,
        produceList: filteredProduces,
      };
    });

    // Filter the pictures array based on the filtered user stands
    // this.filteredUserStands.map((filteredUserStand, i) => {
    //   this.filteredRawPicturesPerProfiles.push([]);
    //   return filteredUserStand.produceList.map((produce, j) => {
    //     this.filteredRawPicturesPerProfiles[i].push(
    //       this.rawPicturesPerProfiles[i][j]
    //     );
    //   });
    // });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredUserStands = [...this.userStandProfiles];
    this.filteredRawPicturesPerProfiles = [...this.rawPicturesPerProfiles];
  }
}
