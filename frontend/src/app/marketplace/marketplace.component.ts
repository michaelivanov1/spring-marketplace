import { Component } from '@angular/core';
import { UserStandService } from '../user-stand/user-stand.service';
import { UserStand } from '../user-stand/user-stand';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartitemDialogComponent } from '../dialogs/cartitem-dialog/cartitem-dialog.component';
import jwt_decode from 'jwt-decode';
import { ProfileService } from '@app/profile/profile.service';
import { SnackbarComponent } from "@app/snackbar/snackbar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})

export class MarketplaceComponent {
  selectedProduct: any;
  userStand?: Observable<UserStand[]>;
  userStandProfiles: UserStand[] = [];
  decodedToken: any;
  loggedInUser: any;
  totalCount: Number | undefined;

  constructor(
    private userStandService: UserStandService,
    private dialog: MatDialog,
    private profileService: ProfileService,
    private snackbarService: SnackbarComponent,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');
    this.profileService.getOne(this.decodedToken.sub);
    this.loggedInUser = this.decodedToken.sub;
    this.snackbarService.open('Loading All Available Produce..');
    this.userStand = this.userStandService.get();
    this.userStand?.subscribe((users: UserStand[]) => {
      this.userStandProfiles = users;

      // get count of items on marketplace
      this.totalCount = this.userStandProfiles.reduce((count, user) => {
        return count + user.produceList.length;
      }, 0);

      this.snackbarService.open('Loaded All Available Produce');
    });
  }

  onProductClick(user: UserStand, produce: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '20vw';
    dialogConfig.height = '50vh';
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      user: user,
      produce: produce,
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
}
