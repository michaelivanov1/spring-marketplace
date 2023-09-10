import { NgModule } from '@angular/core';
import { ObjectId } from '@app/common-interfaces/id-object';

export interface Produce {
  id: ObjectId;
  foodName: string;
  produceImage: string;
  qoh: number;
  // qoo: Number;
  harvestDate: String;
  price: number;
}
