import { NgModule } from '@angular/core';
import { ObjectId } from '@app/common-interfaces/id-object';

export interface Produce {
  id: ObjectId;
  foodName: string;
  qty: Number;
  harvestDate: String;
  price: Number;
}
