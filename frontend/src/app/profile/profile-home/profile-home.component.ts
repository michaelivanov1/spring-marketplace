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
  userStandDataFetched: boolean;
  // add product form
  productForm: FormGroup;

  constructor(
    private profileService: ProfileService,
    private userStandService: UserStandService,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // add product form
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
    this.userStandDataFetched = false;
  }

  saveChanges() {
    this.profileService
      .update(this.userProfile.email, this.updatedProfile)
      .subscribe(
        () => {
          this.userProfile = { ...this.updatedProfile };
          console.log('Profile updated successfully.');
        },
        (error) => {
          console.error('Error updating profile:', error);
        }
      );
  }

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
          this.userStandDataFetched = true;
        } else {
          this.userStandDataFetched = false;
        }
      });
  }

  listItem(result?: any): void {
    console.log('called listitem: ' + JSON.stringify(result));

    // object when adding to existing UserStand
    const produceItemsObj = {
      foodName: result.foodName,
      qty: parseInt(result.qty),
      harvestDate: result.harvestDate,
      price: parseFloat(result.price),
    };
    const itemUpdateUserStand = {
      email: this.decodedToken.sub,
      produce: produceItemsObj,
    };

    // array object when creating new UserStand (0 existing items)
    const produceItemsArr = [
      {
        foodName: result.foodName,
        qty: parseInt(result.qty),
        harvestDate: result.harvestDate,
        price: parseFloat(result.price),
      },
    ];
    const itemCreateUserStand = {
      email: this.decodedToken.sub,
      produceList: produceItemsArr,
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
          this.updateUserStand(itemUpdateUserStand);
        } else {
          // UserStand not created yet, perform add
          this.createUserStand(itemCreateUserStand);
        }
      });
  }

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
        console.log('userstand updated');
      });
  }

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

  openListItemDialog(): void {
    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listItem(result);
      } else {
        // TODO: make proper
        console.log('bad data');
      }
    });
  }

  onHover(): void {
    this.isHovered = true;
  }

  onLeave(): void {
    this.isHovered = false;
  }

  uploadPhoto(): void {
    // TODO: photo uploads
  }

  deleteAccount(): void {
    console.log('Account deleted');
    // TODO: delete userstand
    this.profileService.delete(this.decodedToken.sub).subscribe(
      () => {
        this.navigateToRegister();
      },
      (error) => {
        console.error('Error deleting account:', error);
      }
    );
  }

  navigateToRegister() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/register']);
  }

  getCursor(): string {
    return this.isHovered ? 'pointer' : 'default';
  }

  onProductClick(userStand: UserStand, produce: any): void {
    this.selectedProduct = produce;
    console.log(userStand, produce);
  }

  toggleEdit(): void {
    this.isEditable = !this.isEditable;
    this.updatedProfile.displayName = this.userProfile.displayName;
    this.updatedProfile.phoneNumber = this.userProfile.phoneNumber;
    this.updatedProfile.email = this.userProfile.email;
    this.updatedProfile.description = this.userProfile.description;
  }

  cancelEdit(): void {
    this.isEditable = false;
  }
}
