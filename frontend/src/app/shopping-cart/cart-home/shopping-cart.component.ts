import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Produce } from '@app/common-interfaces/produce';
import { UserStand } from '@app/user-stand/user-stand';
import { CartService } from '../cart.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { Cart, CartItem } from '../cart';
import { ProfileService } from '../../profile/profile.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})

export class ShoppingCartComponent implements OnInit {
  cartItems: { produce: Produce; user: UserStand; counter: number; }[] | null = null;
  isCartEmpty: boolean = false;
  grandTotal: number = 0;
  taxRate: number = 1.13;
  decodedToken: any;
  buyersEmail: any;

  constructor(
    public dialog: MatDialog,
    private cartService: CartService,
    private profileService: ProfileService,
    private router: Router,
  ) { }


  ngOnInit(): void {

    // grab logged in users email
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');
    this.profileService.getOne(this.decodedToken.sub);
    this.buyersEmail = this.decodedToken.sub;

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

  // onCounterInput(event: any, index: number) {

  //   const input = event.target as HTMLInputElement;
  //   // only 0-9 allowed
  //   let sanitizedValue = input.value.replace(/[^0-9]/g, '');

  //   // store max amount of products
  //   const maxQoh = this.cartItems[index].produce.qoh;

  //   const enteredValue = parseInt(sanitizedValue, 10);

  //   // if entered num > max num: set max num of products
  //   if (enteredValue > maxQoh) {
  //     sanitizedValue = maxQoh.toString();
  //     this.cartItems[index].counter = maxQoh;
  //     // if entered num == '': set entered num to 0
  //   } else if (sanitizedValue.trim() === '') {
  //     sanitizedValue = '0';
  //     this.cartItems[index].counter = 0;
  //   } else {
  //     this.cartItems[index].counter = enteredValue;
  //   }
  //   // update input field with entered value
  //   input.value = sanitizedValue;
  // }

  calculateGrandTotal(): number {
    this.grandTotal = 0;

    if (this.cartItems != null) {
      for (const item of this.cartItems) {
        // only update the grand total values if current item count entered is <= product on hand qty
        if (item.counter <= item.produce.qoh) {
          this.grandTotal += item.counter * item.produce.price;
        }
      }
    }

    return this.grandTotal;
  }

  removeCartItem(index: number): void {
    if (this.cartItems !== null) {
      this.cartItems.splice(index, 1);

      if (this.cartItems.length === 0) {
        this.isCartEmpty = true;
      }

      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      this.calculateGrandTotal();
    } else {
      console.log('cart is empty.');
    }
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
    this.cartItems = null;
    this.isCartEmpty = true;
    console.log('clear cart items');
    localStorage.removeItem('cartItems');
    this.calculateGrandTotal();
  }

  purchaseCartItems(): void {
    const sellerEmails: String[] = [];
    const sellerItems: CartItem[][] = [];

    console.log('cart items: ' + JSON.stringify(this.cartItems));

    if (this.cartItems != null) {
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
    }


    for (let i = 0; i < sellerEmails.length; i++) {
      const sellerEmail = sellerEmails[i];
      const items = sellerItems[i];
      // get grand total for current sellers item(s)
      const grandTotal = items.reduce((total, item) => total + item.total, 0);

      const cartItemsObj: Cart = {
        buyerEmail: this.buyersEmail,
        sellerEmail: sellerEmail,
        grandTotal: grandTotal,
        orderProduceList: items,
      };
      console.log(cartItemsObj);

      this.cartService.add(cartItemsObj).subscribe(
        () => {
          localStorage.removeItem('cartItems');
          this.isCartEmpty = true;
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
      data: 'Confirm purchase?'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.purchaseCartItems();
      }
    });
  }

  marketplaceRedirect() {
    this.router.navigate(['/marketplace']);

  }
}