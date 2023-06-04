import { NgModule } from '@angular/core';
/**
 * profile - interface for account details
 */
export interface farmerStand {
  id: ObjectId;
  account: Account;
  produceList: Produce[];
  // profileName: Produce[];
  email: String;
  phoneNumber: String;
  profileImageURI: String;
  profileBannerURI: String;
}

interface Account {
  id: ObjectId;
  username: String;
  email: String;
  password: String;
}

interface Produce {
  id: ObjectId;
  foodName: String;
  qty: Number;
  harvestDate: String;
}

interface ObjectId {
  date: String;
  timestamp: String;
}
