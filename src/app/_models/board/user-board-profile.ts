import { CoordinateLabelEnum } from "../enums/coordinate-label.enum";

export class UserBoardProfile {
  boardSize: number;
  freeMode: boolean;
  coordinateLabel: CoordinateLabelEnum;
  coordinateSize: number;
  darkTileColour: string;
  lightTileColour: string;
  pieceStyle: string;
}
