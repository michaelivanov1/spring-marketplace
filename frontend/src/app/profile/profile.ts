import { NgModule } from '@angular/core';
import { ObjectId } from '../common-interfaces/id-object';
/**
 * profile - interface for account details
 */
export interface Profile {
  id: ObjectId;
  profileName: String;
  description: String;
  phoneNumber: String;
  profileImage: String;
  bannerImage: String;
  creationDate: String;
  email: String;
}
