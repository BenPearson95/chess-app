import { Fen } from "../fens/fen";

export class FenCollectionTableData {
  _id?:string;
  userId: string;
  fenTitle: string;
  createdDate: Date;
  updatedDate: Date;
  numOffens: Number;
  fens: Array<Fen>;
}
