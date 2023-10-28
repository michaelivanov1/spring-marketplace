import { ObjectId } from '../common-interfaces/id-object';
import {Produce} from "@app/common-interfaces/produce";
import {OrderProduce} from "@app/common-interfaces/order-produce";

/**
 * order - interface for order details
 */

export interface Order {
  id: ObjectId;
  buyerEmail: String;
  sellerEmail: String;
  grandTotal: Number;
  invoiceDate: String;
  orderId: String;
  orderProduceList: OrderProduce[];
  qrcodeurl: String;
  qrcodetxt: String;
}
