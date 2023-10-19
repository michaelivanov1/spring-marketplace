import { ObjectId } from '@app/common-interfaces/id-object';

export interface OrderProduce {
  foodName: string;
  qty: number;
  harvestDate: string;
  total: number;
}
