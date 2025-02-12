import React, { FC, createContext, useCallback, useState } from 'react'
import { IPatternCell, IPatternGrid } from '../model/patterncell.model'
import { ACTION_TYPES, actionTypesToKey } from '../model/actiontype.enum'
import {
    DEFAULT_COLOR,
    DEFAULT_COLOR_2,
    DEFAULT_VIEWBOX,
    UNKNOWN_NAME,
    VIEWBOX_MIN_SIZE
} from '../model/constats'
import { loadPattern, loadViewBox, saveLocalDebounced, saveViewBoxDebounced } from '../services/file.service'
import { actionToCellType, CELL_TYPE } from '../model/patterntype.enum'
import { getNewCell } from '../components/pattern/getNetCell'
import { TVIEWBOX_SIZE } from '../components/pattern/windowed/pattern'


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
    pattern: genpatHuge(),
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
    viewBox: TVIEWBOX_SIZE
    gotoViewBox: (row: number, col: number) => void
    gotoViewBoxUp: () => void
    gotoViewBoxDown: () => void
    gotoViewBoxLeft: () => void
    gotoViewBoxRight: () => void
    onGrowViewBoxHeight: () => void
    onShrinkViewBoxHeight: () => void
    onGrowViewBoxWidth: () => void
    onShrinkViewBoxWidth: () => void
    resetViewBox: (pattern: IPattern) => void
    onChageViewBoxWidth: (width: number) => void
    onChageViewBoxHeight: (height: number) => void
}

const initialState: IPatternContext = {
    patternState: initialPattern,
    savePattern: (pattern: IPattern) => { },
    addColumn: (at: number) => { },
    addRow: (at: number) => { },
    fillColumn: (col: number) => { },
    changeCell: (row: number, col: number, mouseOver: boolean) => { },
    deleteColumn: (col: number) => { },
    deleteRow: (row: number) => { },
    fillRow: (row: number) => { },
    fillRight: (row: number, col: number) => { },
    fillLeft: (row: number, col: number) => { },
    newPattern: () => { },
    setShowOpenFileDialog: () => { },
    showOpenFileDialog: false,
    setShowCellStitchType: () => { },
    showPreviewDialog: false,
    setShowPreviewDialog: () => { },
    showCellStitchType: true,
    setMirrorHorizontal: () => { },
    mirrorHorizontal: true,
    setMirrorVertical: () => { },
    mirrorVertical: true,
    setToggleStitch: () => { },
    toggleStitch: true,
    changeColor: (newColor: string, index: number) => { },
    addColor: () => { },
    setSelectedColor: (index: number) => { },
    deleteColor: (index: number) => { },
    saveFontSize: (fontSize: number) => { },
    setAction: (action: ACTION_TYPES) => { },
    changeScale: (increase: boolean) => { },
    resetScale: () => { },
    handleKeyDown: () => { },
    gotoViewBox: () => { },
    gotoViewBoxUp: () => { },
    gotoViewBoxDown: () => { },
    gotoViewBoxLeft: () => { },
    gotoViewBoxRight: () => { },
    onGrowViewBoxHeight: () => { },
    onShrinkViewBoxHeight: () => { },
    onGrowViewBoxWidth: () => { },
    onShrinkViewBoxWidth: () => { },
    resetViewBox: (pattern: IPattern) => { },
    onChageViewBoxWidth: (width: number) => { },
    onChageViewBoxHeight: (height: number) => { },
    viewBox: DEFAULT_VIEWBOX
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
    const [viewBox, setViewBox] = useState<TVIEWBOX_SIZE>(loadViewBox())

    const savePattern = (pattern: IPattern) => {
        saveLocalDebounced(pattern)
        setPatternState({ ...pattern })
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

    const fillRowLeft = (r: IPatternCell[], row: number, col: number): IPatternCell[] => {
        let result = [...r]
        for (let index = col - 1; index >= 0; index--) {
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

    const fillRowRight = (r: IPatternCell[], row: number, col: number): IPatternCell[] => {
        let result = [...r]
        for (let index = col + 1; index < r.length; index++) {
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

    const setSelectedColor = useCallback((index: number) => {
        savePattern({
            ...patternState,
            selectedColorIndex: index,
            selectedAction: ACTION_TYPES.COLOR
        })
    }, [patternState])

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

    const setAction = useCallback((action: ACTION_TYPES) => {
        savePattern({ ...patternState, selectedAction: action })
    }, [patternState])

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

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const key = e.key;
        //console.log(key);

        switch (key) {
            case '1':
                if (patternState.colors.length > 0) setSelectedColor(0)
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
            case actionTypesToKey(ACTION_TYPES.X):
                setAction(ACTION_TYPES.X)
                break;
            case actionTypesToKey(ACTION_TYPES.LXR):
                setAction(ACTION_TYPES.LXR)
                break;
            case actionTypesToKey(ACTION_TYPES.LR):
                setAction(ACTION_TYPES.LR)
                break
            case actionTypesToKey(ACTION_TYPES.L):
                setAction(ACTION_TYPES.L)
                break;
            case actionTypesToKey(ACTION_TYPES.LX):
                setAction(ACTION_TYPES.LX)
                break;
            case actionTypesToKey(ACTION_TYPES.R):
                setAction(ACTION_TYPES.R)
                break;
            case actionTypesToKey(ACTION_TYPES.XR):
                setAction(ACTION_TYPES.XR)
                break;
            case actionTypesToKey(ACTION_TYPES.COLOR):
                setAction(ACTION_TYPES.COLOR)
                break;
            case actionTypesToKey(ACTION_TYPES.NONE):
                setAction(ACTION_TYPES.NONE)
                break;
            case 'v':
                setMirrorVertical(!mirrorVertical)
                break;
            case 'h':
                setMirrorHorizontal(!mirrorHorizontal)
                break;
            case 't':
                setToggleStitch(!toggleStitch)
                break;
            default:
                break;
        }
    }, [patternState.colors, setAction, setSelectedColor, mirrorHorizontal, mirrorVertical, toggleStitch]);

    const gotoViewBox = useCallback((row: number, col: number) => {

        setViewBox((old) => {
            const point = {
                row: Math.min(patternState.pattern.length-1, Math.max(0, row)), 
                col: Math.min(patternState.pattern[0].length-1, Math.max(0, col)) 
            }
            console.log(
                point
            );
            
            
            const newState = { ...old, 
                row: point.row, 
                col: point.col 
            }
            
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern])

    const resetViewBox = useCallback((pattern: IPattern) => {
        setViewBox((old) => {
            const newState = { ...old, 
                row: 0, 
                col: 0, 
                wx: Math.min(DEFAULT_VIEWBOX.wx, pattern.pattern[0].length),
                wy: Math.min(DEFAULT_VIEWBOX.wy, pattern.pattern.length),
            }
            saveViewBoxDebounced(newState)
            return newState
        });
    }, [])

    const gotoViewBoxUp = useCallback(() => {
        setViewBox((old) => {
            const newState = { ...old, row: Math.max(0, old.row - 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [])

    const gotoViewBoxDown = useCallback(() => {
        setViewBox((old) => {
            const newState = { ...old, row: Math.min(patternState.pattern.length - viewBox.wy - 1, old.row + 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern.length, viewBox.wy])

    const gotoViewBoxLeft = useCallback(() => {
        setViewBox((old) => {
            const newState = { ...old, col: Math.max(0, old.col - 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [])

    const gotoViewBoxRight = useCallback(() => {
        setViewBox((old) => {
            const newState = { ...old, col: Math.min(patternState.pattern[0].length - viewBox.wx - 1, old.col + 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern, viewBox.wx])

    const onShrinkViewBoxWidth = useCallback(() => {
        setViewBox((old) => {
            const newState = { ...old, wx: Math.max(VIEWBOX_MIN_SIZE, old.wx - 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [])

    const onGrowViewBoxWidth = useCallback(() => {
        setViewBox((old) => {
            const newState = { ...old, wx: Math.min(patternState.pattern[0].length, old.wx + 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern])

    const onShrinkViewBoxHeight = useCallback(() => {
        setViewBox((old) => {
            const newState = { ...old, wy: Math.max(VIEWBOX_MIN_SIZE, old.wy - 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [])

    const onGrowViewBoxHeight = useCallback(() => {
        setViewBox((old) => {
            const newState = { ...old, wy: Math.min(patternState.pattern.length, old.wy + 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern.length])

    const onChageViewBoxWidth = (widht: number) => {
        setViewBox((old) => {
            const newState = { ...old, wx: Number(widht) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }

    const onChageViewBoxHeight = (height: number) => {
        setViewBox((old) => {
            const newState = { ...old, wy: Number(height) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }

    const value = {
        patternState: patternState,
        savePattern: savePattern,
        addColumn: addColumn,
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
        addColor: addColor,
        setSelectedColor: setSelectedColor,
        deleteColor: deleteColor,
        saveFontSize: saveFontSize,
        setAction: setAction,
        changeScale: changeScale,
        resetScale: resetScale,
        handleKeyDown: handleKeyDown,
        gotoViewBoxUp: gotoViewBoxUp,
        gotoViewBoxDown: gotoViewBoxDown,
        gotoViewBoxLeft: gotoViewBoxLeft,
        gotoViewBoxRight: gotoViewBoxRight,
        onGrowViewBoxHeight: onGrowViewBoxHeight,
        onShrinkViewBoxHeight: onShrinkViewBoxHeight,
        onGrowViewBoxWidth: onGrowViewBoxWidth,
        onShrinkViewBoxWidth: onShrinkViewBoxWidth,
        onChageViewBoxWidth: onChageViewBoxWidth,
        onChageViewBoxHeight: onChageViewBoxHeight,
        gotoViewBox: gotoViewBox,
        resetViewBox: resetViewBox,
        viewBox: viewBox
    }



    return (
        <PatternContext.Provider value={value}>
            {props.children}
        </PatternContext.Provider>
    )
}

export { PatternContextProvider, PatternContext, initialPattern }
