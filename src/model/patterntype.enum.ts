import { ACTION_TYPES } from "./actiontype.enum";

export enum CELL_TYPE {
    EMPTY = '',
    X = 'x',
    L = 'l',
    R = 'r',
    LR = 'lr',
    XR = 'xr',
    LX = 'lx',
    LXR = 'lxr'
}

export const hasX = (type: CELL_TYPE): boolean => {
    return type === CELL_TYPE.X || type === CELL_TYPE.LX || type === CELL_TYPE.XR || type === CELL_TYPE.LXR;
}

export function actionToCellType(action: ACTION_TYPES, type: CELL_TYPE): CELL_TYPE {
    switch (action) {
        case ACTION_TYPES.NONE:
            return CELL_TYPE.EMPTY
        case ACTION_TYPES.X:
            return CELL_TYPE.X
        case ACTION_TYPES.LR:
            return CELL_TYPE.LR
        case ACTION_TYPES.L:
            return CELL_TYPE.L
        case ACTION_TYPES.R:
            return CELL_TYPE.R
        case ACTION_TYPES.LX:
            return CELL_TYPE.LX
        case ACTION_TYPES.XR:
            return CELL_TYPE.XR
        case ACTION_TYPES.LXR:
            return CELL_TYPE.LXR
        default:
            return type;
    }
}

export type TDropDownPos = {
    row: number
    col: number
    x: number
    y: number
    opened: boolean
    viewBoxNumber?: number
}

export type TVIEWBOX_SIZE = {
    row: number,
    col: number,
    wx: number,
    wy: number,
}

export type TCellCoords = {
    row: number
    col: number
}

export type GroupedStitch = {
  type: CELL_TYPE;
  count: number;
};

const stitchTypeMap: Record<CELL_TYPE, string> = {
  [CELL_TYPE.EMPTY]: 'sc',
  [CELL_TYPE.X]: 'DC',
  [CELL_TYPE.L]: 'DC left',
  [CELL_TYPE.R]: 'DC right',
  [CELL_TYPE.LR]: '(DC right, DC left)',
  [CELL_TYPE.LX]: '(DC, DC left)',
  [CELL_TYPE.XR]: '(DC right, DC)',
  [CELL_TYPE.LXR]: '(DC right, DC, DC left)',
};

export const stitchTypeToWritten = (type: CELL_TYPE): string => {
  return stitchTypeMap[type] || '';
}