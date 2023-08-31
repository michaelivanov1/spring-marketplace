import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '@app/generic-http.service';
import { Cart } from './cart';
@Injectable({
  providedIn: 'root',
})
export class CartService extends GenericHttpService<Cart> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `order`);
  } // constructor
} // CartService
