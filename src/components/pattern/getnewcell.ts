import { ACTION_TYPES } from "../../model/actiontype.enum"
import { IPatternCell } from "../../model/patterncell.model"
import { CELL_TYPE } from "../../model/patterntype.enum"

export const getNewCell = (cell: IPatternCell, selectedAction: ACTION_TYPES, selectedColorIndex: number, mouseOver?: boolean, toggleStitch?: boolean) : IPatternCell => {
    switch (selectedAction) {
        case ACTION_TYPES.COLOR:
            return { ...cell, c: selectedColorIndex }
        case ACTION_TYPES.X:
            return {
                ...cell,
                t: mouseOver || !toggleStitch
                    ? CELL_TYPE.X
                    : cell.t === CELL_TYPE.X
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.X
            }
        case ACTION_TYPES.L:
            return {
                ...cell,
                t: mouseOver || !toggleStitch
                    ? CELL_TYPE.L
                    : cell.t === CELL_TYPE.L
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.L
            }
        case ACTION_TYPES.R:
            return {
                ...cell,
                t: mouseOver || !toggleStitch
                    ? CELL_TYPE.R
                    : cell.t === CELL_TYPE.R
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.R
            }
        case ACTION_TYPES.LR:
            return {
                ...cell,
                t: mouseOver || !toggleStitch
                    ? CELL_TYPE.LR
                    : cell.t === CELL_TYPE.LR
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.LR
            }
        case ACTION_TYPES.XR:
            return {
                ...cell,
                t: mouseOver || !toggleStitch
                    ? CELL_TYPE.XR
                    : cell.t === CELL_TYPE.XR
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.XR
            }
        case ACTION_TYPES.LX:
            return {
                ...cell,
                t: mouseOver || !toggleStitch
                    ? CELL_TYPE.LX
                    : cell.t === CELL_TYPE.LX
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.LX
            }
        case ACTION_TYPES.LXR:
            return {
                ...cell,
                t: mouseOver || !toggleStitch
                    ? CELL_TYPE.LXR
                    : cell.t === CELL_TYPE.LXR
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.LXR
            }
        case ACTION_TYPES.NONE:
            return { ...cell, t: CELL_TYPE.EMPTY }
        default:
            return { ...cell }
    }
}