import { IPattern } from '../context'
import { ACTION_TYPES } from './actiontype.enum'
import { DEFAULT_COLOR, DEFAULT_COLOR_2, DEFAULT_FONT_SIZE, UNKNOWN_NAME } from './constats'
import { CELL_TYPE } from './patterntype.enum'

export type IPatternRow_Old = IPatternCell_Old[]
export type IPatternGrid_Old = IPatternRow_Old[]


export interface IPatternCell_Old {
    colorindex: number
    type: CELL_TYPE
}

export interface IPatternCell {
    c: number
    t: CELL_TYPE
}

export type IPatternRow = IPatternCell[]
export type IPatternGrid = IPatternRow[]


export const newPatternCell: IPatternCell = {
    c: 0,
    t: CELL_TYPE.EMPTY
}

export const initialPattern: IPattern = {
    pattern: genpat(),
    colors: [DEFAULT_COLOR, DEFAULT_COLOR_2],
    selectedColorIndex: 0,
    selectedAction: ACTION_TYPES.NONE,
    scaleFactor: 1,
    saved: true,
    name: UNKNOWN_NAME,
    previewFontSize: DEFAULT_FONT_SIZE,
    version: 2
}

function genpat() {
    let newpat: IPatternGrid = []
    for (let row = 0; row < 10; row++) {
        const r: IPatternCell[] = []
        for (let col = 0; col < 10; col++) {
            r.push({
                c: row % 2 > 0 ? 0 : 1,
                t: CELL_TYPE.EMPTY
            })
        }
        newpat.push(r)
    }
    return newpat
}

function genpatHuge() {
    let newpat: IPatternGrid = []
    for (let row = 0; row < 200; row++) {
        const r: IPatternCell[] = []
        for (let col = 0; col < 200; col++) {
            r.push({
                c: row % 2 > 0 ? 0 : 1,
                t: CELL_TYPE.X
            })
        }
        newpat.push(r)
    }
    return newpat
}