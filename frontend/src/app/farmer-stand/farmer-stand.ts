import { NgModule } from '@angular/core';
/**
 * profile - interface for account details
 */
export interface FarmerStand {
  id: ObjectId;
  account: Account;
  produceList: Produce[];
}

interface Account {
  id: ObjectId;
  username: String;
  email: String;
  password: String;
}

interface Produce {
  // id: ObjectId;
  foodName: String;
  qty: Number;
  harvestDate: String;
}

interface ObjectId {
  date: String;
  timestamp: String;
}
