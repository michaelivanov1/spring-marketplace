import {
  Component,
  EventEmitter,
  Inject,
  LOCALE_ID,
  Output,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatCurrency } from '@angular/common';
import { Produce } from '@app/common-interfaces/produce';
import { UserStand } from '@app/user-stand/user-stand';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackbarComponent } from '@app/snackbar/snackbar.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './cartitem-dialog.component.html',
  styleUrls: ['./cartitem-dialog.component.scss'],
})
export class CartitemDialogComponent {
  user: any;
  produce: any;
  rawPicture: any;
  counter: number;
  tempCounter: number;
  price: number;
  subTotal: string;
  cartItemForm: FormGroup;
  qoh: number;
  isRemoved: boolean;
  isEntered: boolean;
  isGreater: boolean;

  @Output() confirmEvent: EventEmitter<{ produce: Produce; counter: number }> =
    new EventEmitter<{ produce: Produce; counter: number }>();

  constructor(
    public dialogRef: MatDialogRef<CartitemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) public locale: string,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarComponent
  ) {
    this.cartItemForm = this.formBuilder.group({
      user: data?.user,
      produce: data?.produce,
      counter: data?.counter,
      price: data?.price,
      subTotal: data?.subTotal,
    });
    this.rawPicture = data.rawPicture;
    this.user = data.user;
    this.produce = data.produce;
    this.counter = 0;
    this.tempCounter = 0;
    this.price = this.produce.price;
    this.subTotal = formatCurrency(this.price, this.locale, '$ ');
    this.qoh = data.qoh;
    this.isRemoved = false;
    this.isEntered = false;
    this.isGreater = false;
  }

  confirm(produce: Produce): void {
    const item: { produce: Produce; user: UserStand; counter: number } = {
      produce: produce,
      user: this.user,
      counter: this.counter,
    };

    // retrieve cart items from localStorage & add to existing cart items from storage
    let cartItemsFromStorage: { produce: Produce; counter: number }[] = [];
    const cartItemsJson = localStorage.getItem('cartItems');
    if (cartItemsJson) {
      cartItemsFromStorage = JSON.parse(cartItemsJson);
    }

    // save the cart item to localStorage
    cartItemsFromStorage.push(item);
    localStorage.setItem('cartItems', JSON.stringify(cartItemsFromStorage));

    this.dialogRef.close();
    this.snackbarService.open('Added Item To Cart');
  }

  cancel(): void {
    console.log('canceled');
    this.dialogRef.close();
  }

  qohChangeButton(change: String): void {
    if (change === '+' && this.counter < this.produce.qoh) {
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
    } else if (this.isGreater === true) {
      return false;
    }
    return true;
  }

  removeNumber() {
    this.isRemoved = true;
    if (this.tempCounter.toString().length - 1 <= 0) {
      this.tempCounter = 0;
    } else {
      this.tempCounter = parseInt(
        this.tempCounter
          .toString()
          .substring(0, this.tempCounter.toString().length - 1)
      );
    }
  }

  validNumber(event: any) {
    this.isEntered = true;
    this.tempCounter = parseInt(this.tempCounter.toString().concat(event.key));
    if (this.tempCounter >= this.produce.qoh) {
      this.isGreater = true;
      this.tempCounter = this.produce.qoh;
    } else {
      this.isGreater = false;
    }
  }

  updateCounterInput() {
    if (this.isRemoved === true) {
      this.counter = this.tempCounter;
      this.isRemoved = false;
    } else if (this.isEntered === true) {
      this.counter = this.tempCounter;
      this.isEntered = false;
    }
    this.subTotal = formatCurrency(
      this.price * this.counter,
      this.locale,
      '$ '
    );
  }
}
