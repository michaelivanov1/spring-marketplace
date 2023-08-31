import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Produce } from '@app/common-interfaces/produce';
import { UserStand } from '@app/user-stand/user-stand';
import { CartService } from '../cart.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Cart, CartItem } from '../cart';

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
    private cartService: CartService
  ) { }


  ngOnInit(): void {
    // retrieve cart items from localStorage
    const cartItemsJson = localStorage.getItem('cartItems');
    if (cartItemsJson) {
      this.isCartEmpty = false;
      const cartItemsFromStorage = JSON.parse(cartItemsJson);
      this.cartItems = cartItemsFromStorage;
      // console.log('cart items: ' + this.cartItems.map((q) => q.produce.qoh));
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

  calculateGrandTotal(): number {
    this.grandTotal = 0;

    for (const item of this.cartItems) {
      // only update the grand total values if current item count entered is <= product on hand qty
      if (item.counter <= item.produce.qoh) {
        this.grandTotal += item.counter * item.produce.price;
      }
    }
    return this.grandTotal;
  }

  removeCartItem(index: number): void {
    this.cartItems.splice(index, 1);
    if (this.cartItems.length === 0) {
      this.isCartEmpty = true;
    }
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.calculateGrandTotal();
  }

  // purchaseIndividualItem(index: number): void {
  //   let selectedItem = this.cartItems[index];

  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '250px',
  //     data: `Purchase ${selectedItem.produce.foodName}?`,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 'confirm') {
  //       // TOTO: add single item purchasing 
  //       console.log('purchased');
  //     } else {
  //       console.log('canceled purchasing individual item');
  //     }
  //   });
  // }

  clearCartItems(): void {
    this.cartItems = [];
    this.isCartEmpty = true;
    console.log('clear cart items');
    localStorage.removeItem('cartItems');
    this.calculateGrandTotal();
  }

  purchaseCartItems(): void {
    const sellerEmails: String[] = [];
    const sellerItems: CartItem[][] = [];
    let buyerEmail = this.cartItems.map((p) => p.user.email)[0];

    for (const item of this.cartItems) {
      const sellerIndex = sellerEmails.indexOf(item.user.email);

      // check if the seller's email is already in the array
      if (sellerIndex === -1) {
        // if not, add the sellers email and the current item to the arrays
        sellerEmails.push(item.user.email);
        sellerItems.push([{
          foodName: item.produce.foodName,
          qty: item.counter,
          harvestDate: item.produce.harvestDate,
          total: item.produce.price * item.counter,
        }]);
      } else {
        // if yes, add the current item to the existing sellers items
        sellerItems[sellerIndex].push({
          foodName: item.produce.foodName,
          qty: item.counter,
          harvestDate: item.produce.harvestDate,
          total: item.produce.price * item.counter,
        });
      }
    }

    for (let i = 0; i < sellerEmails.length; i++) {
      const sellerEmail = sellerEmails[i];
      const items = sellerItems[i];
      // get grand total for current sellers item(s)
      const grandTotal = items.reduce((total, item) => total + item.total, 0);

      const cartItemsObj: Cart = {
        buyerEmail: buyerEmail,
        sellerEmail: sellerEmail,
        grandTotal: grandTotal,
        orderProduceList: items,
      };

      console.log(cartItemsObj);

      this.cartService.add(cartItemsObj).subscribe(
        () => {
          // TODO: update frontend cart with new qoh values
          console.log(`added order to db for seller: ${sellerEmail}`);
        },
        (error) => {
          console.error(`error adding order to db for seller: ${sellerEmail} `, error);
        }
      );
    }
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Are you sure you want to purchase these items?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.purchaseCartItems();
      }
    });
  }
}