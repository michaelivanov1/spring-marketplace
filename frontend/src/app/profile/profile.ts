import { NgModule } from '@angular/core';
/**
 * profile - interface for account details
 */
export interface Profile {
  id: string;
  accountName: String;
  profileName: String;
  email: String;
  phoneNumber: String;
  profileImageURI: String;
  profileBannerURI: String;
}
