import { CELL_TYPE } from "./patterntype.enum";

export interface IPatternCell {
  colorindex: number;
  type: CELL_TYPE;
}

export const newPatternCell: IPatternCell = {
  colorindex: 0,
  type: CELL_TYPE.EMPTY,
};
