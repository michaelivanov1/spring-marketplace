import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '@app/order/order';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
  providedIn: 'root',
})
export class OrderService extends GenericHttpService<Order> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `order`);
  } // constructor
} // OrderService
