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
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

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

  constructor(
    private profileService: ProfileService,
    private userStandService: UserStandService,
    public dialog: MatDialog,
    private router: Router
  ) {
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
    // const updatedProfile: Profile = {
    //   id: this.userProfile.id,
    //   displayName: this.userProfile.displayName,
    //   description: this.userProfile.description,
    //   phoneNumber: this.userProfile.phoneNumber,
    //   profileImage: this.userProfile.profileImage,
    //   creationDate: this.userProfile.creationDate,
    //   email: this.userProfile.email,
    // };

    this.profileService.update(this.userProfile.email, this.updatedProfile)
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
    this.userStandService.getOne(this.decodedToken.sub)
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

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to permanently delete your account?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteAccount();
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
    this.profileService.delete(this.decodedToken.sub)
      .subscribe(
        () => {
          this.navigateToRegister()
        },
        error => {
          console.error('Error deleting account:', error);
        }
      )
  }

  navigateToRegister() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/register'])
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
