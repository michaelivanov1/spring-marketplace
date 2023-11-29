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
import { SnackbarComponent } from '@app/snackbar/snackbar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASEURL } from '@app/constants';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: { produce: Produce; user: UserStand; counter: number }[] | null =
    null;
  isCartEmpty: boolean = false;
  grandTotal: number = 0;
  taxRate: number = 1.13;
  decodedToken: any;
  buyersEmail: any;
  rawpictures: string[] = [];
  msg: string = '';

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private cartService: CartService,
    private profileService: ProfileService,
    private router: Router,
    private snackbarService: SnackbarComponent
  ) { }

  ngOnInit(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );
    // grab logged in users email
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');
    this.profileService.getOne(this.decodedToken.sub);
    this.buyersEmail = this.decodedToken.sub;

    const cartItemsJson = localStorage.getItem('cartItems');

    if (cartItemsJson) {
      const cartItemsFromStorage = JSON.parse(cartItemsJson);

      // check if cartItemsFromStorage is an array and not empty
      if (
        Array.isArray(cartItemsFromStorage) &&
        cartItemsFromStorage.length > 0
      ) {
        this.isCartEmpty = false;
        this.cartItems = cartItemsFromStorage;
        this.rawpictures = [];
        const requests = this.cartItems.map((e) =>
          this.http.get(`${BASEURL}file/${e.produce.produceImage}`, {
            headers,
            responseType: 'blob',
          })
        );
        forkJoin(requests)
          .pipe(
            catchError((err) => {
              this.msg = err.message;
              return of([]);
            })
          )
          .subscribe((responses: any[]) => {
            responses.forEach((imageData: any, index) => {
              const reader = new FileReader();
              reader.onload = () => {
                const currentImage = reader.result as string;
                this.rawpictures[index] = currentImage;
              };
              reader.readAsDataURL(imageData);
            });
          });
      } else {
        this.isCartEmpty = true;
      }
    } else {
      this.isCartEmpty = true;
    }

    this.calculateGrandTotal();
  }

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
      this.rawpictures.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      this.calculateGrandTotal();
      this.snackbarService.open('Removed Item From Cart');
    } else {
    }
  }

  clearCartItems(): void {
    this.isCartEmpty = true;
    this.rawpictures = [];
    localStorage.removeItem('cartItems');
    this.calculateGrandTotal();
    this.snackbarService.open('Your Cart Has Been Emptied');
  }

  purchaseCartItems(): void {
    const sellerEmails: String[] = [];
    const sellerItems: CartItem[][] = [];

    if (this.cartItems != null) {
      for (const item of this.cartItems) {
        const sellerIndex = sellerEmails.indexOf(item.user.email);

        // check if the seller's email is already in the array
        if (sellerIndex === -1) {
          // if not, add the sellers email and the current item to the arrays
          sellerEmails.push(item.user.email);
          sellerItems.push([
            {
              foodName: item.produce.foodName,
              qty: item.counter,
              harvestDate: item.produce.harvestDate,
              total: item.produce.price * item.counter,
            },
          ]);
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

      this.cartService.add(cartItemsObj).subscribe(
        () => {
          localStorage.removeItem('cartItems');
          this.isCartEmpty = true;
          this.snackbarService.open('Successfully Placed Order');
        },
        (error) => {
          console.error(
            `error adding order to db for seller: ${sellerEmail} `,
            error
          );
          this.snackbarService.open(
            'Something Went Wrong: Order Failed To Be Placed'
          );
        }
      );
    }
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Confirm purchase?',
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

  viewOrdersRedirect() {
    this.router.navigate(['/orders']);
  }
}
