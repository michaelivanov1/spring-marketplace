import { NgModule } from '@angular/core';
import { ObjectId } from '../common-interfaces/id-object';

/**
 * cart - interface for shopping cart
 */

export interface CartItem {
  foodName: String;
  qty: Number;
  harvestDate: String;
  total: number;
}

export interface Cart {
  buyerEmail: String;
  sellerEmail: String;
  grandTotal: Number;
  orderProduceList: CartItem[]; 
}