import { Component } from '@angular/core';
import { UserStandService } from '../user-stand/user-stand.service';
import { UserStand } from '../user-stand/user-stand';
import { Profile } from '@app/profile/profile';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartitemDialogComponent } from '../dialogs/cartitem-dialog/cartitem-dialog.component';
import jwt_decode from 'jwt-decode';
import { ProfileService } from '@app/profile/profile.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent {
  selectedProduct: any;
  userStand?: Observable<UserStand[]>;
  // userStandProfile: UserStand;
  userStandProfiles: UserStand[] = [];
  decodedToken: any;
  loggedInUser: any;

  constructor(
    private userStandService: UserStandService,
    private dialog: MatDialog,
    private profileService: ProfileService,
  ) {
  }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');
    this.profileService.getOne(this.decodedToken.sub);
    this.loggedInUser = this.decodedToken.sub;

    this.userStand = this.userStandService.get();
    this.userStand?.subscribe((users: UserStand[]) => {
      this.userStandProfiles = users;
    });
  }

  onProductClick(user: UserStand, produce: any) {
    console.log(`clicked on: ${produce.foodName} sold by ${user.displayName}`);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '40vw';
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
}
