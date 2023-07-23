import { Component } from '@angular/core';
import { UserStandService } from '../user-stand/user-stand.service';
import { UserStand } from '../user-stand/user-stand';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartitemDialogComponent } from '../dialogs/cartitem-dialog/cartitem-dialog.component';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent {
  selectedProduct: any;
  userStand?: Observable<UserStand[]>;
  userStandProfile: UserStand;
  userStandProfiles: UserStand[] = [];

  constructor(
    private userStandService: UserStandService,
    private dialog: MatDialog
  ) {
    this.userStandProfile = {
      displayName: '',
      id: {
        date: '',
        timestamp: '',
      },
      email: '',
      produceList: [
        {
          id: {
            date: '',
            timestamp: '',
          },

          foodName: '',
          qoh: 0,
          harvestDate: '',
          price: 0.0,
        },
      ],
      // profileName: [{
      //   id: {
      //     date: '',
      //     timestamp: '',
      //   },
      //   foodName: '',
      //   qoh: 0,
      //   harvestDate: ''
      // }],
    };
  }

  ngOnInit(): void {
    this.userStand = this.userStandService.get();
    this.userStand?.subscribe((users: UserStand[]) => {
      // populate user stand profiles array
      this.userStandProfiles = users;

      users.forEach((user: UserStand) => {
        // user.produceList.forEach((produce) => {
        //   console.log(produce.foodName, produce.qoh, produce.harvestDate);
        // });
      });
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
