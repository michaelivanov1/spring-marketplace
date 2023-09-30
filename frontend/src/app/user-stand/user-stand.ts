import { ObjectId } from '@app/common-interfaces/id-object';
import { Produce } from '@app/common-interfaces/produce';

/**
 * user-stands - interface for stands details
 */

export interface UserStand {
  id: ObjectId;
  displayName: String;
  email: String;
  produceList: Produce[];
}
