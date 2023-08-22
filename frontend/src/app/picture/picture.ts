import { NgModule } from '@angular/core';
import { ObjectId } from '../common-interfaces/id-object';

export interface Picture {
  lastModified: String;
  lastModifiedDate: Date;
  name: String;
  size: String;
  type: String;
}
