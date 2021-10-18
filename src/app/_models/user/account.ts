import { AccountType } from "../enums/account-type.enum";

export class Account {
  "_id": string;
  "firstname": string;
  "surname": string;
  "email": string;
  "accountType": AccountType;
  "signupDate": Date;
}
