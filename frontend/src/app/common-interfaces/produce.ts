import { ObjectId } from '@app/common-interfaces/id-object';

export interface Produce {
  id: ObjectId;
  foodName: string;
  produceImage: string;
  imageName: string;
  qoh: number;
  harvestDate: String;
  price: number;
}
