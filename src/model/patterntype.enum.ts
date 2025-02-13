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
}

export type TVIEWBOX_SIZE = {
    row: number,
    col: number,
    wx: number,
    wy: number,
    patternWidth: number,
    patternHeight: number,
}