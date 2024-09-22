import React, { FC, createContext, useState } from 'react'
import { IPatternCell } from '../model/patterncell.model'
import { ACTION_TYPES } from '../model/actiontype.enum'
import {
    BACKGROUND_COLOR,
    DEFAULT_COLOR,
    DEFAULT_COLOR_2,
    KEY_STORAGE,
    UNKNOWN_NAME
} from '../model/constats'
import { loadPattern } from '../services/file.service'
import { CELL_TYPE } from '../model/patterntype.enum'
import { getNewCell } from '../components/pattern/getNetCell'

export interface IPattern {
    pattern: IPatternCell[][]
    colors: string[]
    selectedColorIndex: number
    selectedAction: ACTION_TYPES
    scaleFactor: number
    saved: boolean
    name: string,
    previewFontSize?: number
}

function genpat() {
    let newpat: IPatternCell[][] = []
    for (let row = 0; row < 10; row++) {
        const r: IPatternCell[] = []
        for (let col = 0; col < 10; col++) {
            r.push({
                colorindex: row % 2 > 0 ? 0 : 1,
                type: CELL_TYPE.EMPTY
            })
        }
        newpat.push(r)
    }
    return newpat
}

const initialPattern: IPattern = {
    pattern: genpat(),
    colors: [DEFAULT_COLOR, DEFAULT_COLOR_2],
    selectedColorIndex: 0,
    selectedAction: ACTION_TYPES.NONE,
    scaleFactor: 1,
    saved: true,
    name: UNKNOWN_NAME
}

interface IPatternContext {
    patternState: IPattern
    savePattern: (pattern: IPattern) => void
    addColumn: (at: number) => void
    addRow: (at: number) => void
    fillColumn: (col: number) => void
    changeCell: (row: number, col: number, mouseOver: boolean) => void
    deleteColumn: (col: number) => void
    deleteRow: (row: number) => void
    fillRow: (row: number) => void
    fillRight: (row: number, col: number) => void
    fillLeft: (row: number, col: number) => void
    newPattern: () => void
    getCellColor: (row: number, col: number) => string
    showOpenFileDialog: boolean
    setShowOpenFileDialog: React.Dispatch<React.SetStateAction<boolean>>
    showPreviewDialog: boolean
    setShowPreviewDialog: React.Dispatch<React.SetStateAction<boolean>>
    showCellStitchType: boolean
    setShowCellStitchType: React.Dispatch<React.SetStateAction<boolean>>
    mirrorVertical: boolean
    setMirrorVertical: React.Dispatch<React.SetStateAction<boolean>>
    mirrorHorizontal: boolean
    setMirrorHorizontal: React.Dispatch<React.SetStateAction<boolean>>
    toggleStitch: boolean
    setToggleStitch: React.Dispatch<React.SetStateAction<boolean>>
    changeColor: (newColor: string, index: number) => void
    addColor: () => void
    setSelectedColor: (index: number) => void
    deleteColor: (index: number) => void

}

const initialState: IPatternContext = {
    patternState: initialPattern,
    savePattern: (pattern: IPattern) => {},
    addColumn: (at: number) => {},
    addRow: (at: number) => {},
    fillColumn: (col: number) => {},
    changeCell: (row: number, col: number, mouseOver: boolean) => {},
    deleteColumn: (col: number) => {},
    deleteRow: (row: number) => {},
    fillRow: (row: number) => {},
    fillRight: (row: number, col: number) => {},
    fillLeft: (row: number, col: number) => {},
    newPattern: () => {},
    setShowOpenFileDialog: () => {},
    showOpenFileDialog: false,
    setShowCellStitchType: () => {},
    showPreviewDialog: false,
    setShowPreviewDialog: () => {}, 
    showCellStitchType: true,
    setMirrorHorizontal: () => {},
    mirrorHorizontal: true,
    setMirrorVertical: () => {},
    mirrorVertical: true,
    setToggleStitch: () => {},
    toggleStitch: true,
    getCellColor: (row: number, col: number) => {
        return ''
    },
    changeColor: (newColor: string, index: number) => {},
    addColor: () => {},
    setSelectedColor: (index: number) => {},
    deleteColor: (index: number) => {}

}

interface IProps {
    children: any
}

const PatternContext = createContext(initialState)

const PatternContextProvider: FC<IProps> = (props) => {
    const [patternState, setPatternState] = useState<IPattern>(loadPattern())
    const [showOpenFileDialog, setShowOpenFileDialog] = useState(false)
    const [showPreviewDialog, setShowPreviewDialog] = useState(false)
    const [showCellStitchType, setShowCellStitchType] = useState(true)
    const [mirrorVertical, setMirrorVertical] = useState(false)
    const [mirrorHorizontal, setMirrorHorizontal] = useState(false)
    const [toggleStitch, setToggleStitch] = useState(true)

    const savePattern = (pattern: IPattern) => {
        pattern.saved = false
        localStorage.setItem(KEY_STORAGE, JSON.stringify(pattern))
        setPatternState(pattern)
    }

    const newPattern = () => {
        savePattern(initialPattern)
    }



    const getCellColor = (row: number, col: number) => {
        if (
            patternState.pattern[row - 1] &&
            patternState.pattern[row - 1][col - 1] &&
            patternState.pattern[row - 1][col - 1].type.includes('r')
        ) {
            return getColor(row - 1, col - 1)
        } else if (
            patternState.pattern[row - 1] &&
            patternState.pattern[row - 1][col + 1] &&
            patternState.pattern[row - 1][col + 1].type.includes('l')
        ) {
            return getColor(row - 1, col + 1)
        } else if (
            patternState.pattern[row - 1] &&
            patternState.pattern[row - 1][col] &&
            patternState.pattern[row - 1][col].type.includes('x')
        ) {
            return getColor(row - 1, col)
        }
        return getColor(row, col)
    }

    const getColor = (row: number, col: number) => {
        return patternState.pattern[row][col].colorindex >= 0
            ? patternState.colors[patternState.pattern[row][col].colorindex]
            : BACKGROUND_COLOR
    }

    const addColumn = (at: number) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r) => [
                ...r.slice(0, at + 1),
                {
                    colorindex: r[at].colorindex,
                    type: CELL_TYPE.EMPTY
                },
                ...r.slice(at + 1)
            ])
        })
    }

    const addRow = (atRow: number) => {
        let newRow: IPatternCell[] = []
        for (let index = 0; index < patternState.pattern[0].length; index++) {
            newRow.push({
                colorindex: patternState.selectedColorIndex,
                type: CELL_TYPE.EMPTY
            })
        }
        savePattern({
            ...patternState,
            pattern: [
                ...patternState.pattern.slice(0, atRow + 1),
                newRow,
                ...patternState.pattern.slice(atRow + 1)
            ]
        })
    }

    const fillColumn = (col: number) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r) =>
                r.map((c, i) => (i !== col ? c : getNewCell(c, patternState.selectedAction, patternState.selectedColorIndex, false, toggleStitch)))
            )
        })
    }

    const changeCell = (row: number, col: number, mouseOver: boolean) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r, rowI) =>
                rowI === row || (mirrorHorizontal && rowI === patternState.pattern.length - row - 1)
                    ? r.map((c, colI) =>
                          colI === col || (mirrorVertical && colI === r.length - col - 1) ? getNewCell(c, patternState.selectedAction, patternState.selectedColorIndex, mouseOver, toggleStitch) : c
                      )
                    : r
            )
        })
    }

    const deleteColumn = (col: number) => {
        if (!window.confirm(`Do you really want to delete whole column ${col}?`)) return
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r) =>
                r.filter((_c, i) => i !== col)
            )
        })
    }

    const deleteRow = (row: number) => {
        if (!window.confirm(`Do you really want to delete whole row ${row}?`)) return
        savePattern({
            ...patternState,
            pattern: patternState.pattern.filter((_r, i) => i !== row)
        })
    }

    const fillRow = (row: number) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r, i) =>
                i !== row ? r : r.map((c) => getNewCell(c, patternState.selectedAction, patternState.selectedColorIndex, false, toggleStitch))
            )
        })
    }

    const fillRowLeft = (r: IPatternCell[], row: number, col: number): IPatternCell[]  => {
        let result = [...r] 
        for (let index = col-1; index >= 0; index--){
           const cell = result[index];
           if (cell.type !== CELL_TYPE.EMPTY) return result
           result[index] = getNewCell(cell, patternState.selectedAction, patternState.selectedColorIndex, false, toggleStitch)
        }
        return result
    }

    const fillLeft = (row: number, col: number) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r, i) =>
                i !== row ? r : mirrorVertical ? fillRowLeft(fillRowRight(r, row, r.length - col - 1), row, col) : fillRowLeft(r, row, col)
            )
        })
    }

    const fillRowRight = (r: IPatternCell[], row: number, col: number): IPatternCell[]  => {
        let result = [...r] 
        for (let index = col+1; index < r.length; index++){
           const cell = result[index];
           if (cell.type !== CELL_TYPE.EMPTY) return result
           result[index] = getNewCell(cell, patternState.selectedAction, patternState.selectedColorIndex, false, toggleStitch)
        }
        return result
    }

    const fillRight = (row: number, col: number) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r, i) =>
                i !== row ? r : mirrorVertical ? fillRowRight(fillRowLeft(r, row, r.length - col - 1), row, col) : fillRowRight(r, row, col)
            )
        })
    }

    const changeColor = (newColor: string, index: number) => {
        if (patternState.colors.includes(newColor)) return

        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r) =>
                r.map((c) =>
                    c.colorindex === index ? { ...c, colorindex: index } : c
                )
            ),
            colors: patternState.colors.map((c, i) =>
                i === index ? newColor : c
            )
        })
    }

    const addColor = () => {
        savePattern({
            ...patternState,
            colors: [...patternState.colors, DEFAULT_COLOR]
        })
    }

    const setSelectedColor = (index: number) => {
        savePattern({
            ...patternState,
            selectedColorIndex: index,
            selectedAction: ACTION_TYPES.COLOR
        })
    }

    const deleteColor = (index: number) => {
        savePattern({
            ...patternState,
            colors: patternState.colors.filter((c, i) => i !== index)
        })
    }

    const value = {
        patternState,
        savePattern,
        addColumn,
        addRow,
        fillColumn,
        getCellColor,
        changeCell,
        deleteColumn,
        deleteRow,
        fillRow,
        fillRight,
        fillLeft,
        newPattern,
        showOpenFileDialog,
        setShowOpenFileDialog,
        showPreviewDialog,
        setShowPreviewDialog,
        showCellStitchType,
        setShowCellStitchType,
        mirrorVertical,
        setMirrorVertical,
        mirrorHorizontal,
        setMirrorHorizontal,
        toggleStitch,
        setToggleStitch,
        changeColor,
        addColor,
        setSelectedColor,
        deleteColor,
    }

    return (
        <PatternContext.Provider value={value}>
            {props.children}
        </PatternContext.Provider>
    )
}

export { PatternContextProvider, PatternContext, initialPattern }
