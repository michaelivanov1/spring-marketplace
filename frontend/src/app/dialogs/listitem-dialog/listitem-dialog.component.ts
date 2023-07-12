import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-list-item-dialog',
  templateUrl: 'listitem-dialog.component.html',
})
export class ListItemDialogComponent {
  productForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ListItemDialogComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.productForm = this.formBuilder.group({
      foodName: '',
      qty: '',
      harvestDate: '',
      price: ''
    });
  }

  onClose(): void {
    const productFormValue = this.productForm.value;
    this.dialogRef.close(productFormValue);
  }
}