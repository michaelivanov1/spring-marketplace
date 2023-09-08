import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Produce } from '@app/common-interfaces/produce';

@Component({
  selector: 'app-list-item-dialog',
  templateUrl: 'listitem-dialog.component.html',
  styleUrls: ['./listitem-dialog.component.scss'],
})
export class ListItemDialogComponent {
  productForm: FormGroup;

  @Output() updateProduce: EventEmitter<Produce> = new EventEmitter<Produce>();

  constructor(
    public dialogRef: MatDialogRef<ListItemDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Produce
  ) {
    this.productForm = this.formBuilder.group({
      foodName: data?.foodName || '',
      qoh: data?.qoh || '',
      harvestDate: data?.harvestDate || '',
      price: data?.price || ''
    });
  }

  onClose(): void {
    const productFormValue = this.productForm.value;
    const updatedProduce: Produce = {
      ...this.data,
      foodName: productFormValue.foodName,
      qoh: productFormValue.qoh,
      harvestDate: productFormValue.harvestDate,
      price: productFormValue.price
    };
    this.updateProduce.emit(updatedProduce);
    this.dialogRef.close(productFormValue);
  }

  disableFutureDates(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}