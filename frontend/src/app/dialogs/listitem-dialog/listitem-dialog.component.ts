// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { FormGroup, FormBuilder } from '@angular/forms';

// @Component({
//   selector: 'app-list-item-dialog',
//   templateUrl: 'listitem-dialog.component.html',
// })
// export class ListItemDialogComponent {
//   productForm: FormGroup;

//   constructor(
//     public dialogRef: MatDialogRef<ListItemDialogComponent>,
//     private formBuilder: FormBuilder,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {
//     this.productForm = this.formBuilder.group({
//       foodName: data?.foodName || '',
//       qty: data?.qty || '',
//       harvestDate: data?.harvestDate || '',
//       price: data?.price || ''
//     });
//   }

//   onClose(): void {
//     const productFormValue = this.productForm.value;
//     this.dialogRef.close(productFormValue);
//   }
// }


import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Produce } from '@app/common-interfaces/produce';

@Component({
  selector: 'app-list-item-dialog',
  templateUrl: 'listitem-dialog.component.html',
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
      qty: data?.qty || '',
      harvestDate: data?.harvestDate || '',
      price: data?.price || ''
    });
  }

  onClose(): void {
    const productFormValue = this.productForm.value;
    const updatedProduce: Produce = {
      ...this.data,
      foodName: productFormValue.foodName,
      qty: productFormValue.qty,
      harvestDate: productFormValue.harvestDate,
      price: productFormValue.price
    };
    this.updateProduce.emit(updatedProduce);
    this.dialogRef.close(productFormValue);
  }
}