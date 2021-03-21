import { AccountType } from "../enums/account-type.enum";

export class Account {
  "_id": String;
  "firstname": String;
  "surname": String;
  "email": String;
  "accountType": AccountType;
  "signupDate": Date;
}
