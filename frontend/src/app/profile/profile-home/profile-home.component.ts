import { Component, OnInit } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile.service';
import { Profile } from '../profile';
import { UserStandService } from '@app/user-stand/user-stand.service';
import { UserStand } from '@app/user-stand/user-stand';
import jwt_decode from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ListItemDialogComponent } from '../../dialogs/listitem-dialog/listitem-dialog.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Produce } from '@app/common-interfaces/produce';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss'],
})
export class ProfileComponent implements OnInit {

  profile?: Observable<Profile>;
  subscriberStand: any;
  msg: string;
  userProfile: Profile;
  userStand: UserStand;
  isHovered: boolean;
  selectedProduct: any;
  decodedToken: any;
  editableFields: string[];
  updatedProfile: Profile;
  isEditable: boolean;
  dateCreatedFormatted: string;
  userStandDataExists: boolean;
  productForm: FormGroup; // form for adding products
  hoveredProduce: any = null;

  constructor(
    private profileService: ProfileService,
    private userStandService: UserStandService,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // form for adding products
    this.productForm = this.formBuilder.group({
      foodName: '',
      qty: 0,
      harvestDate: '',
      price: '',
    });

    this.msg = '';
    this.isHovered = false;
    this.editableFields = [];
    this.userProfile = {
      id: {
        date: '',
        timestamp: '',
      },
      displayName: '',
      description: '',
      email: '',
      phoneNumber: '',
      profileImage: '',
      creationDate: '',
    };
    this.userStand = {
      id: {
        date: '',
        timestamp: '',
      },
      email: '',
      displayName: '',
      produceList: [],
    };
    this.isEditable = false;
    this.selectedProduct = '';
    this.updatedProfile = { ...this.userProfile };
    this.dateCreatedFormatted = '';
    this.userStandDataExists = false;
  }


  // grab all user's profile data & listings on page init
  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');

    this.profile = this.profileService.getOne(this.decodedToken.sub);

    this.profile.subscribe(
      (profile) => {
        this.userProfile = profile;
        const year = this.userProfile.creationDate.substr(0, 4);
        const month = this.userProfile.creationDate.substr(5, 2);
        const day = this.userProfile.creationDate.substr(8, 2);
        const formattedDate = `${year}-${month}-${day}`;
        this.dateCreatedFormatted = formattedDate;
      },
      (error) => {
        console.error('Error fetching profile:', error);
      }
    );
    catchError((err) => (this.msg = err.message));
    this.profile.forEach((x) => {
      this.userProfile = x;
    });

    // user's listings
    this.userStandService
      .getOne(this.decodedToken.sub)
      .pipe(
        catchError((err) => {
          this.msg = err.message;
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.userStand = data;
          console.log(this.userStand);
          if (this.userStand.produceList.length > 0)
            this.userStandDataExists = true;
        } else {
          this.userStandDataExists = false;
        }
      });
  }

  // handling data from list item for sale dialog
  listItem(result?: any): void {

    // object when adding to existing UserStand
    const produceItemsObj = {
      id: {
        date: '',
        timestamp: '',
      },
      foodName: result.foodName,
      qty: parseInt(result.qty),
      harvestDate: result.harvestDate,
      price: parseFloat(result.price),
    };
    const itemUpdateUserStand = {
      email: this.decodedToken.sub,
      produce: produceItemsObj,
    };

    this.userStandService
      .getOne(this.decodedToken.sub)
      .pipe(
        catchError((err) => {
          this.msg = err.message;
          return of(null);
        })
      )
      .subscribe((existingUserStand) => {
        if (existingUserStand) {
          // UserStand already exists, perform update
          const itemExists = existingUserStand.produceList.some(item => item.foodName === result.foodName);
          if (!itemExists) {
            // add the new item to the produceList
            this.userStand.produceList.push(produceItemsObj);

            // update the userStand on the server
            this.updateUserStand(itemUpdateUserStand);

            // set userStandDataExists flag to true
            this.userStandDataExists = true;
          } else {
            // TODO: display proper error message
            console.log('foodname already exists');
          }
        } else {
          // UserStand not created yet, perform add
          const produceItemsArr = [produceItemsObj];
          const itemCreateUserStand = {
            email: this.decodedToken.sub,
            produceList: produceItemsArr,
          };

          this.createUserStand(itemCreateUserStand);

          this.userStandDataExists = true;
        }
      });
  }

  // handle edit of an existing market listing
  onEditClick(userStand: UserStand, produce: Produce) {
    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      width: '400px',
      data: produce
    });

    dialogRef.componentInstance.updateProduce.subscribe((updatedProduce: Produce) => {
      // grab index of current produce in userStand.produceList
      const index = userStand.produceList.findIndex(item => item.foodName === produce.foodName);
      if (index !== -1) {

        // update the indexed produce object in userStand.produceList with the updatedProduce from the dialog
        userStand.produceList[index] = updatedProduce;

        const produceItemsArr = {
          email: this.userProfile.email,
          produceList: userStand.produceList
        };

        this.updateUserStand(produceItemsArr);
      } else {
        console.error('something went wrong while editing produce item');
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        console.log('closed dialog or bad data (edit listing)');
      }
    });
  }

  // handles deleting of an existing market listing
  onDeleteClick(produce: Produce) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: `Are you sure you want to remove your listing for ${produce.foodName}?`,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.userStandService.deleteProduceItem(this.userProfile.email, produce.foodName).subscribe(
          () => {
            console.log('item deleted: ' + produce.foodName);

            // remove item from produceList. this is so the page reflects the deletion without a page refresh
            this.userStand.produceList = this.userStand.produceList.filter(item => item.foodName !== produce.foodName);
            if (this.userStand.produceList.length == 0) {
              // this.userStandService.delete(this.decodedToken.sub).subscribe(() => console.log('got to 0 items. deleted user stand'));
              this.userStandDataExists = false;
            }
          },
          (error) => {
            console.error('error deleting item: ', error);
          }
        );
      }
    });
  }

  // for brand new accounts, creates a fresh user stand for selling items
  createUserStand(item: any): void {
    this.userStandService
      .add(item)
      .pipe(
        catchError((err) => {
          this.msg = err.message;
          return of(null);
        })
      )
      .subscribe(() => {
        console.log('userstand created');
      });
  }

  // for existing accounts, updates user stand data 
  updateUserStand(item: any): void {
    this.userStandService
      .updateUserStand(item)
      .pipe(
        catchError((err) => {
          this.msg = err.message;
          return of(null);
        })
      )
      .subscribe(() => {
        console.log('userstand updated with data: ' + JSON.stringify(item));
      });
  }

  // wipe all user's data
  deleteAccount(): void {
    console.log('account deleted');
    // delete user's whole stand
    this.userStandService.delete(this.decodedToken.sub).subscribe(
      () => {
        // delete user's whole profile
        this.profileService.delete(this.decodedToken.sub).subscribe(
          () => {
            this.navigateToRegister();
          })
      },
      (error) => {
        console.error('error deleting account:', error);
      }
    );
  }

  // handles saving any updates to your profile
  saveChanges() {
    this.profileService
      .update(this.userProfile.email, this.updatedProfile)
      .subscribe(
        () => {
          this.userProfile = { ...this.updatedProfile };
          console.log('profile updated successfully.');
        },
        (error) => {
          console.error('error updating profile:', error);
        }
      );
  }

  // delete account confirmation dialog
  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to permanently delete your account?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteAccount();
      }
    });
  }

  // dialog for listing new items for sale
  openListItemDialog(): void {
    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listItem(result);
      } 
    });
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

  // upload profile photo
  uploadPhoto(): void {
    // TODO: photo uploads
  }

  // when deleting account, remove jwtToken & navigate user to register component
  navigateToRegister() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/register']);
  }

  // handles togglable/editable user profile info
  toggleEdit(): void {
    this.isEditable = !this.isEditable;
    this.updatedProfile.displayName = this.userProfile.displayName;
    this.updatedProfile.phoneNumber = this.userProfile.phoneNumber;
    this.updatedProfile.email = this.userProfile.email;
    this.updatedProfile.description = this.userProfile.description;
  }

  // handles togglable/editable user profile info
  cancelEdit(): void {
    this.isEditable = false;
  }
}