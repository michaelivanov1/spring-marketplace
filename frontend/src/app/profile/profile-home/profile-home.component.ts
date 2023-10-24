import { Component, ElementRef, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, switchMap, concatMap } from 'rxjs/operators';
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
import { SnackbarComponent } from '@app/snackbar/snackbar.component';
import { BASEURL } from '@app/constants';

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
  productForm: FormGroup;
  hoveredProduce: any = null;
  imageSrc: string;
  emailApiResponse: any;
  pictureApiResponse: any;
  profileImageLoaded: Boolean = false;
  rawProduceImg: string[];

  constructor(
    private http: HttpClient,
    private profileService: ProfileService,
    private userStandService: UserStandService,
    private pictureService: PictureService,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private snackbarService: SnackbarComponent
  ) {
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
    this.rawProduceImg = [];
  }

  // grab all users profile data & listings on page init
  ngOnInit(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );

    this.profileImageLoaded = false;

    this.imageSrc = '../../../assets/profile-image-loading.gif';
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');

    this.profile = this.profileService.getOne(this.decodedToken.sub);

    // grab users profile & format account creation date
    this.profile.subscribe(
      (profile) => {
        this.userProfile = profile;
        const ESTDate = this.convertToEST(this.userProfile.creationDate);
        const year = ESTDate.substr(0, 4);
        const month = ESTDate.substr(5, 2);
        const day = ESTDate.substr(8, 2);
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

    this.profileService
      .getOne(this.decodedToken.sub)
      .pipe(
        switchMap((profile) => {
          this.userProfile = profile; // save the profile from the first call
          if (profile.profileImage === '') {
            this.imageSrc =
              '../../../assets/default-avatar-profile-icon-of-social-media-user-vector.png';
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
          // loop through and api call the images
          // put them in an array
          // change the html to have the the array for pictures
        }
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
      produceImage: '',
      imageName: result.imageName,
      foodName: result.foodName,
      qoh: parseInt(result.qoh),
      harvestDate: result.harvestDate,
      price: parseFloat(result.price),
    };

    // turn base64 to blob file and get ready for file post
    let binaryData = result.produceImage.split(',')[1];
    let blob = new Blob(
      [
        new Uint8Array(binaryData.length).map((_, i) =>
          binaryData.charCodeAt(i)
        ),
      ],
      { type: 'image/jpeg' }
    );
    let file = new File([blob], produceItemsObj.imageName, {
      type: 'image/jpeg',
    });
    let formData = new FormData();
    formData.append('file', file);
    formData.append('email', this.userProfile.email);
    formData.append('type', produceItemsObj.foodName);
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
            this.updateUserStand(this.userStand, formData);
          } else {
            this.snackbarService.open('Food Name Already Exists');
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
          // update the userStand object with the new produceList
          this.userStand = itemCreateUserStand;

          this.createUserStand(itemCreateUserStand, formData);
        }
        this.snackbarService.open('Item Successfully Listed');
      });
  }

  // handle edit of an existing market listing
  onEditClick(userStand: UserStand, produce: Produce) {
    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      width: '400px',
      data: produce,
    });
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );

    dialogRef.componentInstance.updateProduce.subscribe(
      (updatedProduce: Produce) => {
        // grab index of current produce in userStand.produceList
        const index = userStand.produceList.findIndex(
          (item) => item.foodName === produce.foodName
        );
        if (index !== -1) {
          // FormData
          let formData;
          if (updatedProduce.produceImage.includes('data')) {
            let binaryData = updatedProduce.produceImage.split(',')[1];
            let blob = new Blob(
              [
                new Uint8Array(binaryData.length).map((_, i) =>
                  binaryData.charCodeAt(i)
                ),
              ],
              { type: 'image/jpeg' }
            );
            let file = new File([blob], updatedProduce.foodName, {
              type: 'image/jpeg',
            });
            formData = new FormData();
            formData.append('file', file);
            formData.append('email', this.userProfile.email);
            formData.append('type', updatedProduce.foodName);
          } else {
            formData = null;
          }
          // update the indexed produce object in userStand.produceList with the updatedProduce from the dialog
          updatedProduce.produceImage = '';
          userStand.produceList[index] = updatedProduce;

          // update the userStand object with the updated produceList
          this.userStand = {
            ...userStand,
            produceList: [...userStand.produceList],
          };
          this.updateUserStand(this.userStand, formData);
          if (this.useRegex(updatedProduce.produceImage)) {
            this.http
              .delete(`${BASEURL}file/${updatedProduce.produceImage}`, {
                headers,
              })
              .pipe(
                tap(() => {}),
                catchError((error: any) => {
                  console.error('Error deleting profile image:', error);
                  return of(null);
                })
              )
              .subscribe((response) => {
                if (response !== null) {
                  // handle the response if needed
                }
              });
          }
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
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );
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
              this.snackbarService.open('Listing Successfully Deleted');

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
            (error: any) => {
              console.error('error deleting item: ', error);
            }
          );
        // grab index of current produce in userStand.produceList
        const index = this.userStand.produceList.findIndex(
          (item) => item.foodName === produce.foodName
        );
        this.http
          .delete(
            `${BASEURL}file/${this.userStand.produceList[index].produceImage}`,
            {
              headers,
            }
          )
          .pipe(
            tap(() => {}),
            catchError((error: any) => {
              console.error('Error deleting profile image:', error);
              return of(null);
            })
          )
          .subscribe((response) => {
            if (response !== null) {
              // handle the response if needed
            }
          });
      }
    });
  }

  // for brand new accounts (or 0 items for sale), creates a fresh user stand for selling items.
  createUserStand(item: any, imageHandler: any): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );
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
        // check if it needs to call the file post
        if (imageHandler !== null) {
          this.http
            .post(`${BASEURL}file`, imageHandler, {
              headers,
              responseType: 'text', // set responseType to 'text' to avoid parsing as JSON
            })
            .pipe()
            .subscribe(
              () => {
                this.snackbarService.open('Image Uploaded Successfully');
              },
              (error: any) => {
                console.error('Error uploading image:', error);
                this.snackbarService.open('Error Uploading Image');
              }
            );
        }
      });
    // // TODO: temp fix; reload page when first item is loaded so it displays on profile
    // location.reload();
  }

  // for existing accounts (or > 0 items for sale), updates user stand data
  updateUserStand(userStand: UserStand, imageHandler: any): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );
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
        // check if it needs to call the file post
        if (imageHandler !== null) {
          this.http
            .post(`${BASEURL}file`, imageHandler, {
              headers,
              responseType: 'text', // set responseType to 'text' to avoid parsing as JSON
            })
            .pipe()
            .subscribe(
              () => {
                this.snackbarService.open('Image Uploaded Successfully');
              },
              (error: any) => {
                console.error('Error uploading image:', error);
                this.snackbarService.open('Error Uploading Image');
              }
            );
        }
      });
  }

  // wipe all user's data
  deleteAccount(): void {
    this.snackbarService.open('Account Deleted - Data Wiped');
    // delete user's whole stand
    if (this.userStandDataExists) {
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
    // handle display name updates
    this.userStand.displayName = this.updatedProfile.displayName;
    this.updateUserStand(this.userStand, null);

    this.profileService
      .update(this.userProfile.email, this.updatedProfile)
      .subscribe(
        () => {
          this.isEditable = false;
          this.userProfile = { ...this.updatedProfile };
          this.snackbarService.open('Profile Updated Successfully');
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

  // handle uploading profile picture
  onUploadPhoto(event: any): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );

    // check if a file was selected
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png'];

      // only allow file upload if the file extension is allowed
      if (allowedExtensions.includes(fileExtension)) {
        if (this.userProfile.profileImage !== '') {
          // delete the user's previous profile image
          this.http
            .delete(`${BASEURL}file/${this.userProfile.profileImage}`, {
              headers,
            })
            .pipe(
              tap(() => {}),
              catchError((error: any) => {
                console.error('Error deleting profile image:', error);
                return of(null);
              })
            )
            .subscribe((response) => {
              if (response !== null) {
                // handle the response if needed
              }
            });
        }

        let formData = new FormData();
        formData.append('file', file);
        formData.append('email', this.userProfile.email);
        formData.append('type', 'profile');
        reader.onload = (e) => (this.imageSrc = reader.result as string);
        reader.readAsDataURL(file);

        this.http
          .post(`${BASEURL}file`, formData, {
            headers,
            responseType: 'text', // set responseType to 'text' to avoid parsing as JSON
          })
          .subscribe(
            () => {
              this.snackbarService.open('Image Uploaded Successfully');
            },
            (error: any) => {
              console.error('Error uploading image:', error);
              this.snackbarService.open('Error Uploading Image');
            }
          );
      } else {
        this.snackbarService.open('Allowed File Types: jpg, jpeg, png');
        console.error(
          'Invalid file type. Please select an image (jpg, jpeg, png).'
        );
      }
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

  // scrollToSection(sectionId: string) {
  //   const element = this.el.nativeElement.querySelector(`#${sectionId}`);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }

  //helper functions
  convertToEST(dateString: any): string {
    const utcDate = new Date(dateString);
    const estOffset = -4 * 60; // EST is UTC-4

    utcDate.setMinutes(utcDate.getMinutes() + estOffset); // Adjust minutes for EST

    const isoString = utcDate.toISOString(); // Convert back to ISO string

    return isoString;
  }
  useRegex(input: any): boolean {
    let regex =
      /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/i;
    return regex.test(input);
  }
}
