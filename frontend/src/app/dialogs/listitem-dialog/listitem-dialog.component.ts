import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Produce } from '@app/common-interfaces/produce';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SnackbarComponent } from '@app/snackbar/snackbar.component';

@Component({
  selector: 'app-list-item-dialog',
  templateUrl: 'listitem-dialog.component.html',
  styleUrls: ['./listitem-dialog.component.scss'],
})
export class ListItemDialogComponent {
  productForm: FormGroup;
  imageSrc: string;
  imageName: string;

  @Output() updateProduce: EventEmitter<Produce> = new EventEmitter<Produce>();
  dialogTitle: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ListItemDialogComponent>,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackbarService: SnackbarComponent,
    @Inject(MAT_DIALOG_DATA) public data: Produce
  ) {
    this.imageSrc = '';
    this.imageName = '';
    this.productForm = this.formBuilder.group({
      produceImage: [data?.produceImage, Validators.required],
      foodName: [data?.foodName || '', Validators.required],
      qoh: [data?.qoh || '', Validators.required],
      harvestDate: [data?.harvestDate || '', Validators.required],
      price: [data?.price || '', Validators.required],
    });

    if (data) {
      // if editing an existing listing
      this.dialogTitle = 'Edit Listing';
    } else {
      // if adding a new listing
      this.dialogTitle = 'List an Item';
    }
  }

  // handle uploading listing pictures
  onUploadPhoto(event: any): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );

    // check if a file was selected
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png'];

      // only allow file upload if file extension is allowed
      if (allowedExtensions.includes(fileExtension)) {
        this.productForm.get('produceImage')!.setValue(file);
        const formData = new FormData();
        formData.append('file', file);
      } else {
        // clear file input so user has to re-add the picture
        event.target.value = '';
        this.snackbarService.open(
          'Invalid File Type: Please select an image (jpg, jpeg, png)'
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onClose(): void {
    const productFormValue = this.productForm.value;
    const updatedProduce: Produce = {
      ...this.data,
      produceImage: productFormValue.produceImage,
      foodName: productFormValue.foodName,
      qoh: productFormValue.qoh,
      harvestDate: productFormValue.harvestDate,
      price: productFormValue.price,
    };
    this.updateProduce.emit(updatedProduce);
    this.dialogRef.close(productFormValue);
  }

  disableFutureDates(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
