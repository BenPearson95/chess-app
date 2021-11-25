import { Fen } from "../fens/fen";

export class FenCollection {
  _id?:string;
  userId: string;
  fenTitle: string;
  createdDate: Date;
  updatedDate: Date;
  fens: Array<Fen>;
}
