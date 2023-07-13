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
    if (change === '+' && this.counter < this.produce.qty) {
      this.counter++;
    } else if (change === '-' && this.counter > 0) {
      this.counter--;
    }
    this.subTotal = formatCurrency(
      this.price * this.counter,
      this.locale,
      '$ '
    );
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  removeNumber() {
    if (this.counter.toString().length - 1 <= 0) {
      this.counter = 0;
    } else {
      this.counter = parseInt(
        this.counter.toString().substring(0, this.counter.toString().length - 1)
      );
    }
  }

  validNumber(event: any) {
    this.counter = parseInt(this.counter.toString().concat(event.key));
    this.subTotal = formatCurrency(
      this.price * this.counter,
      this.locale,
      '$ '
    );
  }
}
