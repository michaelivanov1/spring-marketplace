import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Produce } from '@app/common-interfaces/produce';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})

export class ShoppingCartComponent implements OnInit {
  cartItems: { produce: Produce; counter: number }[] = [];
  isCartEmpty: boolean = false;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // retrieve cart items from localStorage
    const cartItemsJson = localStorage.getItem('cartItems');
    if (cartItemsJson) {
      this.isCartEmpty = false;
      console.log('cart items from local storage: ' + cartItemsJson);
      const cartItemsFromStorage = JSON.parse(cartItemsJson);
      this.cartItems = cartItemsFromStorage;
    } else {
      this.isCartEmpty = true;
      console.log('cart is empty');
    }
  }

  clearCartItems(): void {
    this.isCartEmpty = true;
    console.log('clear cart items');
    localStorage.removeItem('cartItems');
  }

  purchaseCartItems(): void {
    // TODO: add
    console.log('purchase cart items');
  }
}