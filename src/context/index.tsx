import { initialPattern, IPatternCell, IPatternGrid, IPatternGrid_Old } from '../model/patterncell.model'
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


export interface IPattern_Old {
    pattern: IPatternGrid_Old
    colors: string[]
    selectedColorIndex: number
    selectedAction: ACTION_TYPES
    scaleFactor: number
    saved: boolean
    name: string,
    previewFontSize?: number,
}

export interface IPattern {
    pattern: IPatternGrid
    colors: string[]
    selectedColorIndex: number
    selectedAction: ACTION_TYPES
    scaleFactor: number
    saved: boolean
    name: string,
    previewFontSize?: number,
    version: number
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
    viewBox2: TVIEWBOX_SIZE
    splittedViewBox: boolean
    toggleSplittedViewBox: () => void
    setViewBox: (viewBox: TVIEWBOX_SIZE, viewBoxNumber?: number) => void
    gotoViewBox: (row: number, col: number, viewBoxNumber?: number) => void
    gotoViewBoxUp: (step: number, viewBoxNumber?: number) => void
    gotoViewBoxDown: (step: number, viewBoxNumber?: number) => void
    gotoViewBoxLeft: (step: number, viewBoxNumber?: number) => void
    gotoViewBoxRight: (step: number, viewBoxNumber?: number) => void
    resetViewBox: (pattern: IPatternGrid, viewBoxNumber?: number) => void
    onChageViewBoxWidth: (width: number, viewBoxNumber?: number) => void
    onChageViewBoxHeight: (height: number, viewBoxNumber?: number) => void
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
            const patternHeight = newPat.length;
            const patternWidth = newPat[0].length;

            for (let row = 0; row < bufferHeight; row++) {
                for (let col = 0; col < bufferWidth; col++) {
                    const targetRow = coords.row + row;
                    const targetCol = coords.col + col;
                    if (targetRow < patternHeight && targetCol < patternWidth) {
                        if (full) newPat[targetRow][targetCol] = get().bufferdata[row][col]
                        else newPat[targetRow][targetCol].t = get().bufferdata[row][col].t
                    }
                }
            }
            get().savePattern({ ...get().patternState, pattern: newPat })
        }
    },
    startCopy: { row: 0, col: 0 },
    endCopy: { row: 0, col: 0 },
    setStart: (coords: TCellCoords) => set((state) => ({ startCopy: coords })),
    setEnd: (coords: TCellCoords) => {
        let data = get().patternState.pattern.filter((r, rowIndex) => between(rowIndex, get().startCopy.row, coords.row)
        ).map((r) => r.filter((c, colIndex) => between(colIndex, get().startCopy.col, coords.col)))
        set((state) => ({ ...state, endCopy: coords, bufferdata: data }))
    },
    showBufferData: false,
    toggleShowBufferData: () => set((state) => ({ showBufferData: !state.showBufferData }))

})

function between(value: number, first: number, last: number) {
    let lower = Math.min(first, last), upper = Math.max(first, last);
    return value >= lower && value <= upper;
}

const createPatternSlice: StateCreator<
    PatternSlice & VieboxSlice,
    [],
    [],
    PatternSlice
> = (set, get) => ({
    isPatternWindowed: true,
    toggleIsPatternWindowed: () => set((state) => ({ isPatternWindowed: !state.isPatternWindowed })),
    patternState: initialPattern,
    toggleStitch: true,
    setToggleStitch: (s: boolean) => set((state) => ({ toggleStitch: s })),
    showOpenFileDialog: false,
    setShowOpenFileDialog: (s: boolean) => set((state) => ({ showOpenFileDialog: s })),
    showPreviewDialog: false,
    setShowPreviewDialog: (s: boolean) => set((state) => ({ showPreviewDialog: s })),
    showCellStitchType: true,
    setShowCellStitchType: (s: boolean) => set((state) => ({ showCellStitchType: s })),
    mirrorVertical: false,
    setMirrorVertical: (s: boolean) => set((state) => ({ mirrorVertical: s })),
    mirrorHorizontal: false,
    setMirrorHorizontal: (s: boolean) => set((state) => ({ mirrorHorizontal: s })),
    savePattern: (pattern: IPattern) => {
        if (get().viewBox.row >= pattern.pattern.length || get().viewBox.col >= pattern.pattern[0].length) {
            get().gotoViewBox(0, 0)
            get().gotoViewBox(0, 0, 2)
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
                        c: row[at].c,
                        t: CELL_TYPE.EMPTY
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
                c: get().patternState.selectedColorIndex,
                t: CELL_TYPE.EMPTY
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
    changeCell: (row: number, col: number, mouseOver: boolean) => set((state) => {
        const newPattern = [...state.patternState.pattern.map(r => [...r])];
        const { pattern, selectedAction, selectedColorIndex } = state.patternState;
        const { toggleStitch, mirrorHorizontal, mirrorVertical } = state;

        const updateCell = (r: number, c: number) => {
            if (r >= 0 && r < newPattern.length && c >= 0 && c < newPattern[r].length) {
                newPattern[r][c] = getNewCell(pattern[r][c], selectedAction, selectedColorIndex, mouseOver, toggleStitch);
            }
        };

        updateCell(row, col);
        if (mirrorHorizontal) {
            updateCell(pattern.length - 1 - row, col);
        }
        if (mirrorVertical) {
            updateCell(row, pattern[0].length - 1 - col);
        }
        if (mirrorHorizontal && mirrorVertical) {
            updateCell(pattern.length - 1 - row, pattern[0].length - 1 - col);
        }

        return { patternState: { ...state.patternState, pattern: newPattern } };
    }),
    deleteColumn: (col: number) => {
        if (!window.confirm(`Do you really want to delete whole column ${get().patternState.pattern[0].length - col}?`)) return
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
    fillRight: (row: number, col: number) => set((state) => {
        const { pattern, selectedAction, selectedColorIndex } = state.patternState;
        const { toggleStitch, mirrorVertical } = state;
        const newPattern = pattern.map((r, i) => {
            if (i !== row) return r;
            let newRow = fillRowRight(r, row, col, selectedAction, selectedColorIndex, toggleStitch);
            if (mirrorVertical) {
                newRow = fillRowLeft(newRow, row, r.length - 1 - col, selectedAction, selectedColorIndex, toggleStitch);
            }
            return newRow;
        });
        return { patternState: { ...state.patternState, pattern: newPattern } };
    }),

    fillLeft: (row: number, col: number) => set((state) => {
        const { pattern, selectedAction, selectedColorIndex } = state.patternState;
        const { toggleStitch, mirrorVertical } = state;
        const newPattern = pattern.map((r, i) => {
            if (i !== row) return r;
            let newRow = fillRowLeft(r, row, col, selectedAction, selectedColorIndex, toggleStitch);
            if (mirrorVertical) {
                newRow = fillRowRight(newRow, row, r.length - 1 - col, selectedAction, selectedColorIndex, toggleStitch);
            }
            return newRow;
        });
        return { patternState: { ...state.patternState, pattern: newPattern } };
    }),
    changeColor: (newColor: string, index: number) => {
        if (get().patternState.colors.includes(newColor)) return

        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.map((r) =>
                    r.map((c) =>
                        c.c === index ? { ...c, colorindex: index } : c
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
            case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '0':
                const index = parseInt(key, 10);
                const colorIndex = index === 0 ? 9 : index - 1; // map '0' to index 9
                if (get().patternState.colors.length > colorIndex) {
                    get().setSelectedColor(colorIndex);
                }
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
    viewBox2: DEFAULT_VIEWBOX,
    splittedViewBox: false,
    toggleSplittedViewBox: () => set((state) => ({ splittedViewBox: !state.splittedViewBox })),
    setViewBox: (viewBox: TVIEWBOX_SIZE, viewBoxNumber?: number) => set((state) => {
        if (viewBoxNumber === 2) {
            return { viewBox2: viewBox }
        } else {
            return { viewBox: viewBox }
        }
    }),

    gotoViewBox: (row: number, col: number, viewBoxNumber?: number) => set((state) => {
        return viewBoxNumber === 2 ?
            {
                viewBox2: { // keep own properties like wx, wy
                    ...state.viewBox2,
                    row: Math.max(0, Math.min(get().patternState.pattern.length - 1, Math.max(0, row))),
                    col: Math.max(0, Math.min(get().patternState.pattern[0].length - 1, Math.max(0, col)))
                }
            }
            :
            {
                viewBox: { // keep own properties like wx, wy
                    ...state.viewBox,
                    row: Math.max(0, Math.min(get().patternState.pattern.length - 1, Math.max(0, row))),
                    col: Math.max(0, Math.min(get().patternState.pattern[0].length - 1, Math.max(0, col)))
                }
            }
    }),
    gotoViewBoxUp: (step: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber)
        let newRow = Math.max(0, box.row - step)
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, row: newRow } }
            : { viewBox: { ...box, row: newRow } }
    }),
    gotoViewBoxDown: (step: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber)
        let newRow = box.row + step
        let min = Math.max(0, get().patternState.pattern.length - box.wy)
        newRow = Math.min(min, newRow)

        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, row: newRow } }
            : { viewBox: { ...box, row: newRow } }
    }),
    gotoViewBoxLeft: (step: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber)
        let newCol = Math.max(0, box.col - step)
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, col: newCol } }
            : { viewBox: { ...box, col: newCol } }
    }),
    gotoViewBoxRight: (step: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber)
        let newCol = box.col + step
        let min = Math.max(0, get().patternState.pattern[0].length - box.wx)
        newCol = Math.min(min, newCol)
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, col: newCol } }
            : { viewBox: { ...box, col: newCol } }
    }),
    resetViewBox: () => set((state) => ({
        viewBox: {
            ...state.viewBox,
            row: 0,
            col: 0,
        },
        splittedViewBox: false,
        viewBox2: {
            ...state.viewBox2,
            row: 0,
            col: 0,
        }
    })),
    onChageViewBoxWidth: (width: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber)
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, wx: Math.max(VIEWBOX_MIN_SIZE, width) } }
            : { viewBox: { ...box, wx: Math.max(VIEWBOX_MIN_SIZE, width) } }
    }),
    onChageViewBoxHeight: (height: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber)
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, wy: Math.max(VIEWBOX_MIN_SIZE, height) } }
            : { viewBox: { ...box, wy: Math.max(VIEWBOX_MIN_SIZE, height) } }
    }),

})

const getViewBox = (state: VieboxSlice, viewBoxNumber?: number): TVIEWBOX_SIZE => {
    if (viewBoxNumber === 2) {
        return state.viewBox2
    } else {
        return state.viewBox
    }
}

const fillRowLeft = (r: IPatternCell[], row: number, col: number, selectedAction: ACTION_TYPES, selectedColorIndex: number, toggleStitch: boolean): IPatternCell[] => {
    let result = [...r]
    for (let index = col - 1; index >= 0; index--) {
        const cell = result[index];

        if (cell.t === actionToCellType(selectedAction, cell.t)) return result
        result[index] = getNewCell(cell, selectedAction, selectedColorIndex, false, toggleStitch)
    }
    return result
}



const fillRowRight = (r: IPatternCell[], row: number, col: number, selectedAction: ACTION_TYPES, selectedColorIndex: number, toggleStitch: boolean): IPatternCell[] => {
    let result = [...r]
    for (let index = col + 1; index < r.length; index++) {
        const cell = result[index];
        if (cell.t === actionToCellType(selectedAction, cell.t)) return result
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
            viewBox2: state.viewBox2,
            splittedViewBox: state.splittedViewBox,
            mirrorHorizontal: state.mirrorHorizontal,
            mirrorVertical: state.mirrorVertical,
            toggleStitch: state.toggleStitch,
            showCellStitchType: state.showCellStitchType,
            isPatternWindowed: state.isPatternWindowed,
        }),
        version: 2,
        migrate: (prevState: any, prevVersion) => {
            console.log({ prevState, prevVersion })
            return { ...prevState, patternState: migrateOldPatternState(prevState.patternState) }
        }
    })
);


// migration from old version with context
if (!localStorage.getItem(KEY_STORAGE_ZUSTAND)) {
    let saved = localStorage.getItem(KEY_STORAGE_OLD)
    if (saved) {
        console.log("migrate old context state...");
        useStore.getState().savePattern(loadPattern(saved))
    } else {
        useStore.getState().savePattern(mug)
    }
    // TODO: 
    //localStorage.removeItem(KEY_STORAGE)
} else {
    let saved = localStorage.getItem(KEY_STORAGE_ZUSTAND)
    
    if (saved && saved.indexOf('"version":') === -1) {
        console.log('migrate saved pattern to version 2');
        
        useStore.getState().savePattern(loadOldPattern(saved))
    }
}

export function loadPattern(saved: string): IPattern {
    if (saved.indexOf('"version":') === -1) {
        // old format detected, do conversion
        console.log('load old pattern format')
        return loadOldPattern(saved)
    } else {
               
        let pattern = JSON.parse(saved) as IPattern
        if (!pattern.name) pattern.name = UNKNOWN_NAME
        return pattern
    }
}

export function loadOldPattern(saved: string): IPattern {
    let oldpattern = JSON.parse(saved) as IPattern_Old
    let newpat: IPatternGrid = []
    for (let row = 0; row < oldpattern.pattern.length; row++) {
        const r: IPatternCell[] = []
        for (let col = 0; col < oldpattern.pattern[0].length; col++) {
            const oldcell = oldpattern.pattern[row][col] as any
            r.push({
                c: oldcell.colorindex,
                t: oldcell.type
            })
        }
        newpat.push(r)
    }
    let pattern: IPattern = {
        ...oldpattern,
        pattern: newpat,
        version: 2
    }
    if (!pattern.name) pattern.name = UNKNOWN_NAME
    return pattern
}

export function migrateOldPatternState(oldState: any): IPattern {
    if (!oldState) return initialPattern
    if (oldState.version && oldState.version >= 2) return oldState as IPattern

    let oldpattern = oldState as IPattern_Old
    let newpat: IPatternGrid = []
    for (let row = 0; row < oldpattern.pattern.length; row++) {
        const r: IPatternCell[] = []
        for (let col = 0; col < oldpattern.pattern[0].length; col++) {
            const oldcell = oldpattern.pattern[row][col] as any
            r.push({
                c: oldcell.colorindex,
                t: oldcell.type
            })
        }
        newpat.push(r)
    }
    let pattern: IPattern = {
        ...oldpattern,
        pattern: newpat,
        version: 2
    }
    if (!pattern.name) pattern.name = UNKNOWN_NAME
    return pattern
}