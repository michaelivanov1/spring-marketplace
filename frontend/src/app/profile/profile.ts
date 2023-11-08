import { ObjectId } from '../common-interfaces/id-object';

/**
 * profile - interface for account details
 */

export interface Profile {
  id: ObjectId;
  displayName: String;
  description: String;
  phoneNumber: String;
  profileImage: String;
  creationDate: string;
  email: string;
  produceListSize?: number;
}