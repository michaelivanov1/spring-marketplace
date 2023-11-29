import { Component, ElementRef, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrderService } from '../order.service';
import { Order } from '../order';
import jwt_decode from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SnackbarComponent } from '@app/snackbar/snackbar.component';
import { BASEURL } from '@app/constants';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  order?: Observable<Order>;
  msg: string;
  userOrder: Order;
  decodedToken: any;
  orders: Order[] = [];
  ordersLoaded: boolean = false;
  currentUserEmail: string = "";
  qrcodebase64str: string = "";

  constructor(
    private http: HttpClient,
    private orderService: OrderService,
    public dialog: MatDialog,
    private snackbarService: SnackbarComponent,
    private sanitizer: DomSanitizer
  ) {
    this.msg = '';
    this.userOrder = {
      id: {
        date: '',
        timestamp: '',
      },
      buyerEmail: '',
      sellerEmail: '',
      grandTotal: 0.0,
      invoiceDate: '',
      orderId: '',
      orderProduceList: [],
      qrcodeurl: '',
      qrcodetxt: '',
    };
    this.currentUserEmail = "";
    this.qrcodebase64str = "";
  }

  ngOnInit(): void {
    this.decodedToken = jwt_decode(localStorage.getItem('jwtToken') + '');
    this.currentUserEmail = this.decodedToken.sub;
    this.getAllOrders();
  }

  getAllOrders() : any {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('jwtToken')}`
    );

    this.orderService.get().subscribe(
      (data) => {
        this.orders = data.filter((order) => order.buyerEmail == this.currentUserEmail);
        this.ordersLoaded = true;
        console.log(this.orders);
      },
      (error) => {
        console.error('Error loading orders:', error);
      }
    );
  }

  setImageSource(str: any): void {
    this.qrcodebase64str = str;
  }

  getSanitizedImageSource(): SafeResourceUrl {
    const data = `data:image/png;base64,${this.qrcodebase64str}`;
    return this.sanitizer.bypassSecurityTrustUrl(data);
  }

}
