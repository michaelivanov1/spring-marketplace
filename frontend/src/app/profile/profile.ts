import { NgModule } from '@angular/core';
/**
 * profile - interface for account details
 */
export interface Profile {
  id: ObjectId;
  accountName: String;
  profileName: String;
  email: String;
  phoneNumber: String;
  profileImageURI: String;
  profileBannerURI: String;
}

interface ObjectId {
  date: String;
  timestamp: String;
}
