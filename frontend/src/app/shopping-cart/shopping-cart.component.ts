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

  calculateGrandTotal(): void {
    this.grandTotal = 0;
    for (const item of this.cartItems) {
      this.grandTotal += item.counter * item.produce.price;
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

  continueShopping(): void {
    
  }

  purchaseCartItems(): void {
    // TODO: add all item purchasing
    console.log('purchase all cart items');
  }
}