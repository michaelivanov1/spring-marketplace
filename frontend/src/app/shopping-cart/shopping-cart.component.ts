import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Produce } from '@app/common-interfaces/produce';
import { UserStand } from '@app/user-stand/user-stand';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})

export class ShoppingCartComponent implements OnInit {
  cartItems: { produce: Produce; user: UserStand; counter: number }[] = [];
  isCartEmpty: boolean = false;
  grandTotal: number = 0;
  taxRate: number = 1.13;

  constructor(
    public dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    // retrieve cart items from localStorage
    const cartItemsJson = localStorage.getItem('cartItems');
    if (cartItemsJson) {
      this.isCartEmpty = false;
      const cartItemsFromStorage = JSON.parse(cartItemsJson);
      this.cartItems = cartItemsFromStorage;
    } else {
      this.isCartEmpty = true;
      console.log('cart is empty');
    }

    this.calculateGrandTotal();
  }

  onCounterInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    // only 0-9 allowed
    let sanitizedValue = input.value.replace(/[^0-9]/g, '');

    // store max amount of products
    const maxQoh = this.cartItems[index].produce.qoh;

    const enteredValue = parseInt(sanitizedValue, 10);

    // if entered num > max num: set max num of products
    if (enteredValue > maxQoh) {
      sanitizedValue = maxQoh.toString();
      this.cartItems[index].counter = maxQoh;
      // if entered num == '': set entered num to 0
    } else if (sanitizedValue.trim() === '') {
      sanitizedValue = '0';
      this.cartItems[index].counter = 0;
    } else {
      this.cartItems[index].counter = enteredValue;
    }

    // update input field with entered value
    input.value = sanitizedValue;
  }

  calculateGrandTotal(): void {
    this.grandTotal = 0;

    for (const item of this.cartItems) {
      // only update the grand total values if current item count entered is <= product on hand qty
      if (item.counter <= item.produce.qoh) {
        this.grandTotal += item.counter * item.produce.price;
      }
    }
  }

  removeCartItem(index: number): void {
    this.cartItems.splice(index, 1);
    if (this.cartItems.length === 0) {
      this.isCartEmpty = true;
    }
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateGrandTotal();
  }

  purchaseIndividualItem(index: number): void {
    let selectedItem = this.cartItems[index];

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: `Purchase just ${selectedItem.produce.foodName}?`,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        // TOTO: add single item purchasing 
        console.log('purchased');
      } else {
        console.log('canceled purchasing individual item');
      }
    });
  }

  clearCartItems(): void {
    this.cartItems = [];
    this.isCartEmpty = true;
    console.log('clear cart items');
    localStorage.removeItem('cartItems');
    this.calculateGrandTotal();
  }

  purchaseCartItems(): void {
    // TODO: add all item purchasing
    console.log('purchase all cart items');
  }
}