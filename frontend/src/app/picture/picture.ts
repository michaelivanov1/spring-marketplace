import { ObjectId } from '../common-interfaces/id-object';

export interface Picture {
  id: ObjectId;
  lastModified: String;
  lastModifiedDate: Date;
  name: String;
  size: String;
  type: String;
}
