import { initialPattern, IPatternCell, IPatternGrid } from '../model/patterncell.model'
import { ACTION_TYPES, actionTypesToKey } from '../model/actiontype.enum'
import {
    DEFAULT_COLOR,
    DEFAULT_VIEWBOX,
    KEY_STORAGE_OLD,
    KEY_STORAGE_ZUSTAND,
    UNKNOWN_NAME,
    VIEWBOX_MIN_SIZE
} from '../model/constats'

import { actionToCellType, CELL_TYPE, TCellCoords, TVIEWBOX_SIZE } from '../model/patterntype.enum'
import { getNewCell } from '../components/pattern/getnewcell'

import { create, StateCreator } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { mug } from '../sampledata/mug'

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

interface PatternSlice {
    isPatternWindowed: boolean
    toggleIsPatternWindowed: () => void
    patternState: IPattern
    showOpenFileDialog: boolean
    setShowOpenFileDialog: (s: boolean) => void
    showPreviewDialog: boolean
    setShowPreviewDialog: (s: boolean) => void
    showCellStitchType: boolean
    setShowCellStitchType: (s: boolean) => void
    mirrorVertical: boolean
    setMirrorVertical: (s: boolean) => void
    mirrorHorizontal: boolean
    setMirrorHorizontal: (s: boolean) => void
    toggleStitch: boolean
    setToggleStitch: (s: boolean) => void
    savePattern: (pattern: IPattern) => void
    newPattern: () => void
    addColumn: (at: number) => void
    addRow: (at: number) => void
    changeCell: (row: number, col: number, mouseOver: boolean) => void
    deleteColumn: (col: number) => void
    deleteRow: (row: number) => void
    fillRow: (row: number) => void
    fillColumn: (col: number) => void
    fillRight: (row: number, col: number) => void
    fillLeft: (row: number, col: number) => void
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

interface VieboxSlice {
    viewBox: TVIEWBOX_SIZE
    setViewBox: (viewBox: TVIEWBOX_SIZE) => void
    gotoViewBox: (row: number, col: number) => void
    gotoViewBoxUp: (step: number) => void
    gotoViewBoxDown: (step: number) => void
    gotoViewBoxLeft: (step: number) => void
    gotoViewBoxRight: (step: number) => void
    resetViewBox: (pattern: IPatternGrid) => void
    onChageViewBoxWidth: (width: number) => void
    onChageViewBoxHeight: (height: number) => void
}

interface CopyBufferSlice {
    bufferdata: IPatternGrid
    paste: (coords: TCellCoords, full?: boolean) => void
    startCopy: TCellCoords
    endCopy: TCellCoords
    setStart: (coords: TCellCoords) => void
    setEnd: (coords: TCellCoords) => void
    showBufferData: boolean,
    toggleShowBufferData: () => void
}

const createCopyBufferSlice: StateCreator<
    CopyBufferSlice & PatternSlice & VieboxSlice,
    [],
    [],
    CopyBufferSlice
> = (set, get) => ({
    bufferdata: [],
    paste: (coords: TCellCoords, full?: boolean) => {
        if (get().bufferdata.length > 0) {
            const newPat = [...get().patternState.pattern]
            const bufferWidth = get().bufferdata[0].length
            const bufferHeight = get().bufferdata.length
            for (let row = 0; row < bufferHeight; row++) {
                for (let col = 0; col < bufferWidth; col++) {
                    if (full) newPat[coords.row + row][coords.col + col] = get().bufferdata[row][col]
                    else newPat[coords.row + row][coords.col + col].type = get().bufferdata[row][col].type
                }
            }
            get().savePattern({...get().patternState, pattern: newPat})
        }
    },
    startCopy: {row: 0, col: 0},
    endCopy: {row: 0, col: 0},
    setStart: (coords: TCellCoords) => set((state) => ({startCopy: coords})),
    setEnd: (coords: TCellCoords) =>  {        
        let data =  get().patternState.pattern.filter((r, rowIndex) => between(rowIndex, get().startCopy.row, coords.row)
        ).map((r) => r.filter((c, colIndex) => between(colIndex, get().startCopy.col, coords.col )))
        set((state) => ({...state, endCopy: coords, bufferdata: data}))
    },
    showBufferData: false,
    toggleShowBufferData: () => set((state) => ({showBufferData: !state.showBufferData}))

})

function between(value: number,first: number,last: number) {
    let lower = Math.min(first,last) , upper = Math.max(first,last);
    return value >= lower &&  value <= upper ;
}

const createPatternSlice: StateCreator<
    PatternSlice & VieboxSlice,
    [],
    [],
    PatternSlice
> = (set, get) => ({
    isPatternWindowed: true,
    toggleIsPatternWindowed: () => set((state) => ({isPatternWindowed: !state.isPatternWindowed})),
    patternState: initialPattern,
    toggleStitch: true,
    setToggleStitch: (s: boolean) => set((state) => ({toggleStitch: s})),
    showOpenFileDialog: false,
    setShowOpenFileDialog: (s: boolean) => set((state) => ({showOpenFileDialog: s})),
    showPreviewDialog: false,
    setShowPreviewDialog: (s: boolean) => set((state) => ({showPreviewDialog: s})),
    showCellStitchType: true,
    setShowCellStitchType: (s: boolean) => set((state) => ({showCellStitchType: s})),
    mirrorVertical: false,
    setMirrorVertical: (s: boolean) => set((state) => ({mirrorVertical: s})),
    mirrorHorizontal: false,
    setMirrorHorizontal: (s: boolean) => set((state) => ({mirrorHorizontal: s})),
    savePattern: (pattern: IPattern) =>  {        
        if (get().viewBox.row > pattern.pattern[0].length || get().viewBox.col > pattern.pattern.length) {
            get().gotoViewBox(0, 0)
        }
        set((state) => ({ patternState: pattern }))
    },
    newPattern: () => set((state) => ({ patternState: initialPattern })),
    addColumn: (at: number) => {
        set((state) => ({
        patternState: {
            ...state.patternState, pattern: state.patternState.pattern.map((row) => [
                ...row.slice(0, at + 1),
                {
                    colorindex: row[at].colorindex,
                    type: CELL_TYPE.EMPTY
                },
                ...row.slice(at + 1)
            ])
        }
    }))
    },
    addRow: (atRow: number) => {
        let newRow: IPatternCell[] = []
        for (let index = 0; index < get().patternState.pattern[0].length; index++) {
            newRow.push({
                colorindex: get().patternState.selectedColorIndex,
                type: CELL_TYPE.EMPTY
            })
        }
        set((state) => ({
            patternState: {
                ...state.patternState, pattern: [
                    ...state.patternState.pattern.slice(0, atRow + 1),
                    newRow,
                    ...state.patternState.pattern.slice(atRow + 1)
                ]
            }
        }))
    },
    fillColumn: (col: number) => set((state) => ({
        patternState: {
            ...state.patternState,
            pattern: state.patternState.pattern.map((r) =>
                r.map((c, i) => (i !== col ? c : getNewCell(c, state.patternState.selectedAction, state.patternState.selectedColorIndex, false, state.toggleStitch)))
            )
        }
    })),
    changeCell: (row: number, col: number, mouseOver: boolean) => set((state) => ({
        patternState: {
            ...state.patternState,
            pattern: state.patternState.pattern.map((r, rowI) =>
                rowI === row || (state.mirrorHorizontal && rowI === state.patternState.pattern.length - row - 1)
                    ? r.map((c, colI) =>
                        colI === col || (state.mirrorVertical && colI === r.length - col - 1) ? getNewCell(c, state.patternState.selectedAction, state.patternState.selectedColorIndex, mouseOver, state.toggleStitch) : c
                    )
                    : r
            )
        }
    })),
    deleteColumn: (col: number) => {
        if (!window.confirm(`Do you really want to delete whole column ${get().patternState.pattern[0].length - col }?`)) return
        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.map((r) =>
                    r.filter((_c, i) => i !== col)
                )
            }
        }))
    },
    deleteRow: (row: number) => {
        if (!window.confirm(`Do you really want to delete whole row ${get().patternState.pattern.length - row}?`)) return
        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.filter((_r, i) => i !== row)
            }
        }))
    },
    fillRow: (row: number) => set((state) => ({
        patternState: {
            ...state.patternState,
            pattern: state.patternState.pattern.map((r, i) =>
                i !== row ? r : r.map((c) => getNewCell(c, state.patternState.selectedAction, state.patternState.selectedColorIndex, false, state.toggleStitch))
            )
        }
    })),
    fillRight: (row: number, col: number) => set((state) => ({
        patternState: {
            ...state.patternState,
            pattern: state.patternState.pattern.map((r, i) =>
                i !== row ? r : state.mirrorVertical ? fillRowRight(
                    fillRowLeft(r, row, r.length - col - 1, state.patternState.selectedAction, state.patternState.selectedColorIndex, state.toggleStitch),
                    row, col, state.patternState.selectedAction, state.patternState.selectedColorIndex, state.toggleStitch)
                    : fillRowRight(r, row, col, state.patternState.selectedAction, state.patternState.selectedColorIndex, state.toggleStitch)
            )
        }
    })),

    fillLeft: (row: number, col: number) => set((state) => ({
        patternState: {
            ...state.patternState,
            pattern: state.patternState.pattern.map((r, i) =>
                i !== row ? r : state.mirrorVertical ? fillRowLeft(
                    fillRowRight(r, row, r.length - col - 1, state.patternState.selectedAction, state.patternState.selectedColorIndex, state.toggleStitch),
                    row, col, state.patternState.selectedAction, state.patternState.selectedColorIndex, state.toggleStitch)
                    : fillRowLeft(r, row, col, state.patternState.selectedAction, state.patternState.selectedColorIndex, state.toggleStitch)
            )
        }
    })),
    changeColor: (newColor: string, index: number) => {
        if (get().patternState.colors.includes(newColor)) return

        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.map((r) =>
                    r.map((c) =>
                        c.colorindex === index ? { ...c, colorindex: index } : c
                    )
                ),
                colors: state.patternState.colors.map((c, i) =>
                    i === index ? newColor : c
                )
            }
        }))
    },
    addColor: () => set((state) => ({
        patternState: {
            ...state.patternState,
            colors: [...state.patternState.colors, DEFAULT_COLOR]
        }
    })),
    setSelectedColor: (index: number) => set((state) => ({
        patternState: {
            ...state.patternState,
            selectedColorIndex: index,
            selectedAction: ACTION_TYPES.COLOR
        }
    })
    ),
    deleteColor: (index: number) => set((state) => ({
        patternState: {
            ...state.patternState,
            colors: state.patternState.colors.filter((c, i) => i !== index)
        }
    })
    ),
    saveFontSize: (fontSize: number) => set((state) => ({
        patternState: {
            ...state.patternState,
            previewFontSize: fontSize
        }
    })
    ),
    setAction: (action: ACTION_TYPES) => set((state) => ({
        patternState: {
            ...state.patternState,
            selectedAction: action
        }
    })
    ),
    changeScale: (increase: boolean) => {
        let factor = get().patternState.scaleFactor || 1

        if (!increase && factor > 0.1) {
            set((state) => ({ patternState: { ...state.patternState, scaleFactor: factor - 0.1 } }))
            return
        }
        if (increase && factor < 10)
            set((state) => ({ patternState: { ...state.patternState, scaleFactor: factor + 0.1 } }))
    },
    resetScale: () => set((state) => ({ patternState: { ...state.patternState, scaleFactor: 1 } })),
    handleKeyDown: (event: KeyboardEvent) => {
        const key = event.key;
        if (event.ctrlKey || event.altKey) return

        switch (key) {
            case '1':
                if (get().patternState.colors.length > 0) get().setSelectedColor(0)
                break;
            case '2':
                if (get().patternState.colors.length > 1) get().setSelectedColor(1)
                break;
            case '3':
                if (get().patternState.colors.length > 2) get().setSelectedColor(2)
                break;
            case '4':
                if (get().patternState.colors.length > 3) get().setSelectedColor(3)
                break;
            case '5':
                if (get().patternState.colors.length > 4) get().setSelectedColor(4)
                break;
            case '6':
                if (get().patternState.colors.length > 5) get().setSelectedColor(5)
                break;
            case '7':
                if (get().patternState.colors.length > 6) get().setSelectedColor(6)
                break;
            case '8':
                if (get().patternState.colors.length > 7) get().setSelectedColor(7)
                break;
            case '9':
                if (get().patternState.colors.length > 8) get().setSelectedColor(8)
                break;
            case '0':
                if (get().patternState.colors.length > 9) get().setSelectedColor(9)
                break;
            case actionTypesToKey(ACTION_TYPES.X):
                get().setAction(ACTION_TYPES.X)
                break;
            case actionTypesToKey(ACTION_TYPES.LXR):
                get().setAction(ACTION_TYPES.LXR)
                break;
            case actionTypesToKey(ACTION_TYPES.LR):
                get().setAction(ACTION_TYPES.LR)
                break
            case actionTypesToKey(ACTION_TYPES.L):
                get().setAction(ACTION_TYPES.L)
                break;
            case actionTypesToKey(ACTION_TYPES.LX):
                get().setAction(ACTION_TYPES.LX)
                break;
            case actionTypesToKey(ACTION_TYPES.R):
                get().setAction(ACTION_TYPES.R)
                break;
            case actionTypesToKey(ACTION_TYPES.XR):
                get().setAction(ACTION_TYPES.XR)
                break;
            case actionTypesToKey(ACTION_TYPES.COLOR):
                get().setAction(ACTION_TYPES.COLOR)
                break;
            case actionTypesToKey(ACTION_TYPES.NONE):
                get().setAction(ACTION_TYPES.NONE)
                break;
            case 'v':
                set((state) => ({ mirrorVertical: !state.mirrorVertical }))
                break;
            case 'h':
                set((state) => ({ mirrorHorizontal: !state.mirrorHorizontal }))
                break;
            case 't':
                set((state) => ({ toggleStitch: !state.toggleStitch }))
                break;
            default:
                break;
        }
    },
})

const createViewBoxSlice: StateCreator<
PatternSlice & VieboxSlice,
[],
[],
VieboxSlice
> = (set, get) => ({
    viewBox: DEFAULT_VIEWBOX,
    setViewBox: (viewBox: TVIEWBOX_SIZE) => set((state) => ({viewBox: viewBox})),
    gotoViewBox: (row: number, col: number) => set((state) => {        
        return {
            viewBox: {
                ...state.viewBox,
                row: Math.max(0, Math.min(get().patternState.pattern.length - 1, Math.max(0, row))),
                col: Math.max(0, Math.min(get().patternState.pattern[0].length - 1, Math.max(0, col)))
            }
        }
    }),
    gotoViewBoxUp: (step: number) => set((state) => {
        let newRow = Math.max(0, state.viewBox.row - step)
        return {viewBox: { ...state.viewBox, row: newRow } }
    }),
    gotoViewBoxDown: (step: number) => set((state) => {
        let newRow = state.viewBox.row + step
        let min = Math.max(0, get().patternState.pattern.length - state.viewBox.wy)
        newRow = Math.min(min, newRow)
        
        return { viewBox: { ...state.viewBox, row: newRow }}
    }),
    gotoViewBoxLeft: (step: number) => set((state) => {
        let newCol = Math.max(0, state.viewBox.col - step)
        return { viewBox: { ...state.viewBox, col: newCol } }
    }),
    gotoViewBoxRight: (step: number) => set((state) => {
        let newCol = state.viewBox.col + step
        let min = Math.max(0, get().patternState.pattern[0].length - state.viewBox.wx)
        newCol = Math.min(min, newCol)
        return { viewBox: { ...state.viewBox, col: newCol }}
    }),
    resetViewBox: () => set((state) => ({
        viewBox: {
            ...state.viewBox,
            row: 0,
            col: 0,
        }
    })),
    onChageViewBoxWidth: (width: number) => set((state) => {
        return {
        viewBox: { ...state.viewBox, wx: Math.max(VIEWBOX_MIN_SIZE, width) }
    }}),
    onChageViewBoxHeight: (height: number) => set((state) => {
        return {
        viewBox: { ...state.viewBox, wy: Math.max(VIEWBOX_MIN_SIZE, height) }
    }}),

})







const fillRowLeft = (r: IPatternCell[], row: number, col: number, selectedAction: ACTION_TYPES, selectedColorIndex: number, toggleStitch: boolean): IPatternCell[] => {
    let result = [...r]
    for (let index = col - 1; index >= 0; index--) {
        const cell = result[index];

        if (cell.type === actionToCellType(selectedAction, cell.type)) return result
        result[index] = getNewCell(cell, selectedAction, selectedColorIndex, false, toggleStitch)
    }
    return result
}



const fillRowRight = (r: IPatternCell[], row: number, col: number, selectedAction: ACTION_TYPES, selectedColorIndex: number, toggleStitch: boolean): IPatternCell[] => {
    let result = [...r]
    for (let index = col + 1; index < r.length; index++) {
        const cell = result[index];
        if (cell.type === actionToCellType(selectedAction, cell.type)) return result
        result[index] = getNewCell(cell, selectedAction, selectedColorIndex, false, toggleStitch)
    }
    return result
}


export const useStore = create<PatternSlice & VieboxSlice & CopyBufferSlice>()(
    persist(
        devtools((...a) => ({
    ...createPatternSlice(...a),
    ...createViewBoxSlice(...a),
    ...createCopyBufferSlice(...a),
  })), {
    name: KEY_STORAGE_ZUSTAND,
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ 
        patternState: state.patternState, 
        viewBox: state.viewBox, 
        mirrorHorizontal: state.mirrorHorizontal,
        mirrorVertical: state.mirrorVertical,
        toggleStitch: state.toggleStitch,
        showCellStitchType: state.showCellStitchType,
        isPatternWindowed: state.isPatternWindowed,
    }),
  })
);
  

// migration from old version with context
if (!localStorage.getItem(KEY_STORAGE_ZUSTAND))  {
    
    let saved = localStorage.getItem(KEY_STORAGE_OLD)
    if (saved) {
        console.log("migrate old context state...");
        let pattern = JSON.parse(saved) as IPattern
        if (!pattern.name) pattern.name = UNKNOWN_NAME
        useStore.getState().savePattern(pattern)
    } else {
        useStore.getState().savePattern(mug)
    }
    // TODO: 
    //localStorage.removeItem(KEY_STORAGE)
}