import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './cartitem-dialog.component.html',
  styleUrls: ['./cartitem-dialog.component.scss'],
})
export class CartitemDialogComponent {
  user: any;
  produce: any;
  counter: number;
  price: number;
  subTotal: string;
  constructor(
    public dialogRef: MatDialogRef<CartitemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.user = data.user;
    this.produce = data.produce;
    this.counter = 1;
    this.price = this.produce.price;
    this.subTotal = formatCurrency(this.price, this.locale, '$ ');
  }

  confirm(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
  qtyChange(change: String): void {
    this.price = this.produce.price;
    if (change === '+') {
      this.counter++;
    } else if (this.counter > 0) {
      this.counter--;
    }
    this.price = this.price * this.counter;
    console.log(this.price);
    this.subTotal = formatCurrency(this.price, this.locale, '$ ');
    console.log(this.subTotal);
  }

  numberOnly(event: any): boolean {
    this.price = this.produce.price;
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    console.log(event);
    this.price = this.price * parseInt(event.key);
    console.log(this.price);
    this.subTotal = formatCurrency(this.price, this.locale, '$ ');
    console.log(this.subTotal);
    return true;
  }
}
