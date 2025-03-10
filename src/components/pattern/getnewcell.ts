import { ACTION_TYPES } from "../../model/actiontype.enum"
import { IPatternCell } from "../../model/patterncell.model"
import { CELL_TYPE } from "../../model/patterntype.enum"

export const getNewCell = (c: IPatternCell, selectedAction: ACTION_TYPES, selectedColorIndex: number, mouseOver?: boolean, toggleStitch?: boolean) => {
    switch (selectedAction) {
        case ACTION_TYPES.COLOR:
            return { ...c, colorindex: selectedColorIndex }
        case ACTION_TYPES.X:
            return {
                ...c,
                type: mouseOver || !toggleStitch
                    ? CELL_TYPE.X
                    : c.type === CELL_TYPE.X
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.X
            }
        case ACTION_TYPES.L:
            return {
                ...c,
                type: mouseOver || !toggleStitch
                    ? CELL_TYPE.L
                    : c.type === CELL_TYPE.L
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.L
            }
        case ACTION_TYPES.R:
            return {
                ...c,
                type: mouseOver || !toggleStitch
                    ? CELL_TYPE.R
                    : c.type === CELL_TYPE.R
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.R
            }
        case ACTION_TYPES.LR:
            return {
                ...c,
                type: mouseOver || !toggleStitch
                    ? CELL_TYPE.LR
                    : c.type === CELL_TYPE.LR
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.LR
            }
        case ACTION_TYPES.XR:
            return {
                ...c,
                type: mouseOver || !toggleStitch
                    ? CELL_TYPE.XR
                    : c.type === CELL_TYPE.XR
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.XR
            }
        case ACTION_TYPES.LX:
            return {
                ...c,
                type: mouseOver || !toggleStitch
                    ? CELL_TYPE.LX
                    : c.type === CELL_TYPE.LX
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.LX
            }
        case ACTION_TYPES.LXR:
            return {
                ...c,
                type: mouseOver || !toggleStitch
                    ? CELL_TYPE.LXR
                    : c.type === CELL_TYPE.LXR
                      ? CELL_TYPE.EMPTY
                      : CELL_TYPE.LXR
            }
        case ACTION_TYPES.NONE:
            return { ...c, type: CELL_TYPE.EMPTY }
        default:
            return { ...c }
    }
}