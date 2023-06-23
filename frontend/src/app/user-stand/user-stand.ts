import { NgModule } from '@angular/core';
/**
 * profile - interface for account details
 */
export interface UserStand {
  id: ObjectId;
  displayName: String;
  produceList: Produce[];
}

interface Produce {
  id: ObjectId;
  foodName: String;
  qty: Number;
  harvestDate: String;
  price: Number;
}

interface ObjectId {
  date: String;
  timestamp: String;
}
