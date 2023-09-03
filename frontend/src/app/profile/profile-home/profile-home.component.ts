import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProfileService } from '../profile.service';
import { Profile } from '../profile';
import { UserStandService } from '@app/user-stand/user-stand.service';
import { PictureService } from '@app/picture/picture.service';
import { UserStand } from '@app/user-stand/user-stand';
import jwt_decode from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ListItemDialogComponent } from '../../dialogs/listitem-dialog/listitem-dialog.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Produce } from '@app/common-interfaces/produce';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  imageSrc: string;

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private userStandService: UserStandService,
    private pictureService: PictureService,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // form for adding products
    this.productForm = this.formBuilder.group({
      foodName: '',
      qoh: 0,
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
    this.imageSrc = '';
  }

  // grab all users profile data & listings on page init
  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');

    this.profile = this.profileService.getOne(this.decodedToken.sub);

    // grab users profile & format account creation date
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
          if (this.userStand.produceList.length > 0)
            this.userStandDataExists = true;
        } //else {
        //   // this.userStandDataExists = false;
        // }
      });
  }

  // handle data from list item for sale dialog
  listItem(result?: any): void {
    // object when adding to existing UserStand
    const produceItemsObj = {
      id: {
        date: '',
        timestamp: '',
      },
      foodName: result.foodName,
      qoh: parseInt(result.qoh),
      harvestDate: result.harvestDate,
      price: parseFloat(result.price),
    };

    this.userStandService
      .getOne(this.userProfile.email)
      .pipe(
        catchError((err) => {
          this.msg = err.message;
          return of(null);
        })
      )
      .subscribe((existingUserStand) => {
        if (existingUserStand) {
          // UserStand already exists, perform update
          const itemExists = existingUserStand.produceList.some(
            (item) => item.foodName === result.foodName
          );
          if (!itemExists) {
            // add the new item to the produceList
            this.userStand.produceList.push(produceItemsObj);

            // update the userStand object with the new produceList
            this.userStand.produceList = this.userStand.produceList;

            // update the userStand on the server
            this.updateUserStand(this.userStand);
          } else {
            // TODO: display proper error message
            console.log('foodname already exists');
          }
        } else {
          // userStand not created yet, perform add
          const produceItemsArr = [produceItemsObj];
          const itemCreateUserStand: UserStand = {
            id: {
              date: '',
              timestamp: '',
            },
            email: this.userProfile.email,
            displayName: '',
            produceList: produceItemsArr,
          };
          this.createUserStand(itemCreateUserStand);
        }
      });
  }

  // handle edit of an existing market listing
  onEditClick(userStand: UserStand, produce: Produce) {
    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      width: '400px',
      data: produce,
    });

    dialogRef.componentInstance.updateProduce.subscribe(
      (updatedProduce: Produce) => {
        // grab index of current produce in userStand.produceList
        const index = userStand.produceList.findIndex(
          (item) => item.foodName === produce.foodName
        );
        if (index !== -1) {
          // update the indexed produce object in userStand.produceList with the updatedProduce from the dialog
          userStand.produceList[index] = updatedProduce;

          // update the userStand object with the updated produceList
          this.userStand = {
            ...userStand,
            produceList: [...userStand.produceList],
          };

          this.updateUserStand(this.userStand);
        } else {
          console.error('something went wrong while editing produce item');
        }
      }
    );

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
        this.userStandService
          .deleteProduceItem(this.userProfile.email, produce.foodName)
          .subscribe(
            () => {
              console.log('item deleted: ' + produce.foodName);

              // remove item from produceList. this is so the page reflects the deletion without a page refresh
              this.userStand.produceList = this.userStand.produceList.filter(
                (item) => item.foodName !== produce.foodName
              );
              if (this.userStand.produceList.length == 0) {
                this.userStandService
                  .delete(this.userProfile.email)
                  .subscribe(() =>
                    console.log('got to 0 items. deleted user stand')
                  );
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

  // for brand new accounts (or 0 items for sale), creates a fresh user stand for selling items
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
        this.userStandDataExists = true;
        console.log('userstand created');
      });
  }

  // for existing accounts (or > 0 items for sale), updates user stand data
  updateUserStand(userStand: UserStand): void {
    this.userStandService
      .updateUserStand(userStand)
      .pipe(
        catchError((err) => {
          this.msg = err.message;
          return of(null);
        })
      )
      .subscribe(() => {
        this.userStandDataExists = true;
        console.log('userstand updated');
      });
  }

  // wipe all user's data
  deleteAccount(): void {
    console.log('account deleted');
    // delete user's whole stand
    if (this.userStandDataExists) {
      console.log('userstand exists, so deleting userstand and profile');
      this.userStandService.delete(this.userProfile.email).subscribe(
        () => {
          // delete user's whole profile
          this.profileService.delete(this.userProfile.email).subscribe(() => {
            this.navigateToRegister();
          });
        },
        (error) => {
          console.error('error deleting account:', error);
        }
      );
    } else {
      console.log('userstand doesnt exist, so only deleting profile');
      this.profileService.delete(this.userProfile.email).subscribe(() => {
        this.navigateToRegister();
      }),
        (error: any) => {
          console.error('error deleting account:', error);
        };
    }
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
  onUploadPhoto(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      let formData = new FormData();
      let email = this.userProfile.email;
      formData.append('file', file);
      formData.append('email', email);

      reader.onload = (e) => (this.imageSrc = reader.result as string);

      reader.readAsDataURL(file);
      // console.log(formData.get('photo'));
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('jwtToken')}`)
      this.http
        .post('http://localhost:8080/api/file', formData, {
          headers,
        })
        .subscribe(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            //console.error('not added to db: ', error);
          }
        );
      //this.pictureService.upload(file);
      //console.log("passed");
    }
  }

  // when deleting account, remove jwtToken & navigate user to register component
  navigateToRegister() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/register']);
  }

  // handles toggle-able/editable user profile info
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
