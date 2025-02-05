import React, { FC, createContext, useState } from 'react'
import { IPatternCell, IPatternGrid } from '../model/patterncell.model'
import { ACTION_TYPES } from '../model/actiontype.enum'
import {
    DEFAULT_COLOR,
    DEFAULT_COLOR_2,
    UNKNOWN_NAME
} from '../model/constats'
import { loadPattern, saveLocalDebounced } from '../services/file.service'
import { actionToCellType, CELL_TYPE } from '../model/patterntype.enum'
import { getNewCell } from '../components/pattern/getNetCell'


export interface IPattern {
    pattern: IPatternGrid
    colors: string[]
    selectedColorIndex: number
    selectedAction: ACTION_TYPES
    scaleFactor: number
    saved: boolean
    name: string,
    previewFontSize?: number
}

function genpat() {
    let newpat: IPatternGrid = []
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

function genpatHuge() {
    let newpat: IPatternGrid = []
    for (let row = 0; row < 200; row++) {
        const r: IPatternCell[] = []
        for (let col = 0; col < 200; col++) {
            r.push({
                colorindex: row % 2 > 0 ? 0 : 1,
                type: CELL_TYPE.X
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
    saveFontSize: (fontSize: number) => void
    setAction: (action: ACTION_TYPES) => void
    changeScale: (increase: boolean) => void
    resetScale: () => void
    handleKeyDown: (event: KeyboardEvent) => void
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
    changeColor: (newColor: string, index: number) => {},
    addColor: () => {},
    setSelectedColor: (index: number) => {},
    deleteColor: (index: number) => {},
    saveFontSize: (fontSize: number) => {},
    setAction: (action: ACTION_TYPES) => {},
    changeScale: (increase: boolean) => {},
    resetScale: () => {},
    handleKeyDown: () => {}

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
        saveLocalDebounced(pattern) 
        setPatternState({...pattern})
    }

    const newPattern = () => {
        savePattern(initialPattern)
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

           if (cell.type === actionToCellType(patternState.selectedAction, cell.type)) return result
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
           if (cell.type === actionToCellType(patternState.selectedAction, cell.type)) return result
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

    const saveFontSize = (fontSize: number) => {
        savePattern({
            ...patternState,
            previewFontSize: fontSize
        })
    }

    const setAction = (action: ACTION_TYPES) => {
        savePattern({ ...patternState, selectedAction: action })
    }

    const changeScale = (increase: boolean) => {
        let factor = patternState.scaleFactor || 1

        if (!increase && factor > 0.1) {
            savePattern({ ...patternState, scaleFactor: factor - 0.1 })
            return
        }
        if (increase && factor < 10)
            savePattern({ ...patternState, scaleFactor: factor + 0.1 })
    }

    const resetScale = () => {
        savePattern({ ...patternState, scaleFactor: 1 })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key;
        console.log(key);
        
        switch (key) {
           case '1':
               if (patternState.colors.length > 0)
                   setSelectedColor(0)
               break;
           case '2':
               if (patternState.colors.length > 1) setSelectedColor(1)
               break;
           case '3':
               if (patternState.colors.length > 2) setSelectedColor(2)
               break;
           case '4':
               if (patternState.colors.length > 3) setSelectedColor(3)
               break;
           case '5':
               if (patternState.colors.length > 4) setSelectedColor(4)
               break;
           case '6':
               if (patternState.colors.length > 5) setSelectedColor(5)
               break;
           case '7':
               if (patternState.colors.length > 6) setSelectedColor(6)
               break;
           case '8':
               if (patternState.colors.length > 7) setSelectedColor(7)
               break;
           case '9':
               if (patternState.colors.length > 8) setSelectedColor(8)
               break;
           case '0':
               if (patternState.colors.length > 9) setSelectedColor(9)
               break;
           case 'x':
               setAction(ACTION_TYPES.X) 
               break;
           case 'X':
               setAction(ACTION_TYPES.LXR)
               break;
           case 'b':
               setAction(ACTION_TYPES.LR)
               break
           case 'l':
               setAction(ACTION_TYPES.L)
               break;
           case 'L':
               setAction(ACTION_TYPES.LX)
               break;
           case 'r':
               setAction(ACTION_TYPES.R)
               break;
           case 'R':
               setAction(ACTION_TYPES.XR)
               break;
           case 'c':
               setAction(ACTION_TYPES.COLOR)
               break;
           case 'Escape':
           case 'e':
               setAction(ACTION_TYPES.NONE)
               break;
           default:
               break;
        }
        
   };

    const value = {
        patternState,
        savePattern,
        addColumn,
        addRow,
        fillColumn,
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
        saveFontSize,
        setAction,
        changeScale,
        resetScale,
        handleKeyDown
    }    

    return (
        <PatternContext.Provider value={value}>
            {props.children}
        </PatternContext.Provider>
    )
}

export { PatternContextProvider, PatternContext, initialPattern }
