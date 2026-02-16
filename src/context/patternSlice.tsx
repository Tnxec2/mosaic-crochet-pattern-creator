import { StateCreator } from 'zustand';
import { IPattern } from '.';
import { HistorySlice } from './historySlice';
import { VieboxSlice } from './viewBoxSlice';
import { getNewCell } from '../components/pattern/getnewcell';
import { ACTION_TYPES, actionKeys, actionTypesToKey, keyToActionType, mirrorActionType } from '../model/actiontype.enum';
import { DEFAULT_COLOR } from '../model/constats';
import { initialPattern, IPatternCell } from '../model/patterncell.model';
import { actionToCellType, CELL_TYPE } from '../model/patterntype.enum';

export const createPatternSlice: StateCreator<
    PatternSlice & VieboxSlice & HistorySlice, [], [], PatternSlice
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
    savePattern: (pattern: IPattern, ignoreHistory?: boolean) => {
        // Save current state to history before modification
        if (!ignoreHistory)
            get().addPatternStateToHistory(get().patternState);
        if (get().viewBox.row >= pattern.pattern.length || get().viewBox.col >= pattern.pattern[0].length) {
            get().gotoViewBox(0, 0);
            get().gotoViewBox(0, 0, 2);
        }
        set((state) => ({ patternState: pattern }));
    },
    newPattern: () => set((state) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(state.patternState);
        return { patternState: initialPattern };
    }),
    addColumn: (at: number) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        set((state) => {
            // Ensure patternState is a new object for history tracking
            const newPatternState = {
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
            };
            return newPatternState;
        });
    },
    addRow: (atRow: number) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);

        let newRow: IPatternCell[] = [];
        for (let index = 0; index < get().patternState.pattern[0].length; index++) {
            newRow.push({
                c: get().patternState.selectedColorIndex,
                t: CELL_TYPE.EMPTY
            });
        }
        set((state) => {
            // Ensure patternState is a new object for history tracking
            const newPatternState = {
                patternState: {
                    ...state.patternState, pattern: [
                        ...state.patternState.pattern.slice(0, atRow + 1),
                        newRow,
                        ...state.patternState.pattern.slice(atRow + 1)
                    ]
                }
            };
            return newPatternState;
        });
    },
    fillColumn: (col: number) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.map((r) => // Map creates new array, good for immutability
                    r.map((c, i) => (i !== col ? c : getNewCell(c, state.patternState.selectedAction, state.patternState.selectedColorIndex, false, state.toggleStitch)))
                )
            }
        }));
    },
    changeCell: (row: number, col: number, mouseOver: boolean) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        set((state) => {
            const newPattern = [...state.patternState.pattern.map(r => [...r])];
            const { pattern, selectedAction, selectedColorIndex } = state.patternState;
            const { toggleStitch, mirrorHorizontal, mirrorVertical } = state;

            const updateCell = (r: number, c: number, action: ACTION_TYPES) => {
                if (r >= 0 && r < newPattern.length && c >= 0 && c < newPattern[r].length) {
                    newPattern[r][c] = getNewCell(pattern[r][c], action, selectedColorIndex, mouseOver, toggleStitch);
                }
            };

            updateCell(row, col, selectedAction);
            if (mirrorHorizontal) {
                updateCell(pattern.length - 1 - row, col, selectedAction);
            }
            if (mirrorVertical) {
                updateCell(row, pattern[0].length - 1 - col, mirrorActionType(selectedAction));
            }
            if (mirrorHorizontal && mirrorVertical) {
                updateCell(pattern.length - 1 - row, pattern[0].length - 1 - col, mirrorActionType(selectedAction));
            }

            return { patternState: { ...state.patternState, pattern: newPattern } };
        });
    },
    deleteColumn: (col: number) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        if (!window.confirm(`Do you really want to delete whole column ${get().patternState.pattern[0].length - col}?`)) return;
        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.map((r) => r.filter((_c, i) => i !== col)
                )
            }
        }));
    },
    deleteRow: (row: number) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        if (!window.confirm(`Do you really want to delete whole row ${get().patternState.pattern.length - row}?`)) return;
        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.filter((_r, i) => i !== row)
            }
        }));
    },
    fillRow: (row: number) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.map((r, i) => // Map creates new array, good for immutability
                    i !== row ? r : r.map((c) => getNewCell(c, state.patternState.selectedAction, state.patternState.selectedColorIndex, false, state.toggleStitch))
                )
            }
        }));
    },
    fillRight: (row: number, col: number) => {
        get().addPatternStateToHistory(get().patternState);
        set((state) => {
            const { pattern, selectedAction, selectedColorIndex } = state.patternState;
            const { toggleStitch, mirrorVertical } = state;
            const newPattern = pattern.map((r, i) => {
                if (i !== row) return r;
                let newRow = fillRowRight(r, row, col, selectedAction, selectedColorIndex, toggleStitch);
                if (mirrorVertical) {
                    newRow = fillRowLeft(newRow, row, r.length - 1 - col, mirrorActionType(selectedAction), selectedColorIndex, toggleStitch);
                }
                return newRow;
            });
            return { patternState: { ...state.patternState, pattern: newPattern } };
        });
    },

    fillLeft: (row: number, col: number) => {
        get().addPatternStateToHistory(get().patternState);
        set((state) => {
            const { pattern, selectedAction, selectedColorIndex } = state.patternState;
            const { toggleStitch, mirrorVertical } = state;
            const newPattern = pattern.map((r, i) => {
                if (i !== row) return r;
                let newRow = fillRowLeft(r, row, col, selectedAction, selectedColorIndex, toggleStitch);
                if (mirrorVertical) {
                    newRow = fillRowRight(newRow, row, r.length - 1 - col, mirrorActionType(selectedAction), selectedColorIndex, toggleStitch);
                }
                return newRow;
            });
            return { patternState: { ...state.patternState, pattern: newPattern } };
        });
    },
    changeColor: (newColor: string, index: number) => {
        if (get().patternState.colors.includes(newColor)) return;
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);

        set((state) => ({
            patternState: {
                ...state.patternState,
                pattern: state.patternState.pattern.map((r) => r.map((c) => c.c === index ? { ...c, colorindex: index } : c
                )
                ),
                colors: state.patternState.colors.map((c, i) => i === index ? newColor : c
                )
            }
        }));
    },
    addColor: () => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        set((state) => ({
            patternState: {
                ...state.patternState,
                colors: [...state.patternState.colors, DEFAULT_COLOR]
            }
        }));
    },
    setSelectedColor: (index: number) => set((state) => ({
        patternState: {
            ...state.patternState,
            selectedColorIndex: index,
            selectedAction: ACTION_TYPES.COLOR
        }
    })
    ),
    deleteColor: (index: number) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        set((state) => ({
            patternState: {
                ...state.patternState,
                colors: state.patternState.colors.filter((c, i) => i !== index)
            }
        }));
    },
    saveFontSize: (fontSize: number) => {
        set((state) => ({
            patternState: {
                ...state.patternState,
                previewFontSize: fontSize
            }
        }));
    },
    setAction: (action: ACTION_TYPES) => {
        set((state) => ({
            patternState: {
                ...state.patternState,
                selectedAction: action
            }
        }));
    },
    changeScale: (increase: boolean) => {
        let factor = get().patternState.scaleFactor || 1;

        if (!increase && factor > 0.1) {
            set((state) => ({ patternState: { ...state.patternState, scaleFactor: factor - 0.1 } }));
            return;
        }
        if (increase && factor < 10)
            set((state) => ({ patternState: { ...state.patternState, scaleFactor: factor + 0.1 } }));
    },
    resetScale: () => {
        set((state) => ({ patternState: { ...state.patternState, scaleFactor: 1 } }));
    },
    handleKeyDown: (event: KeyboardEvent) => {
        const key = event.key; // Normalize key to lowercase
        if (event.ctrlKey || event.altKey) return;

        // dont take action on edit pattern name 
        if (document.activeElement?.id === 'pattern-name-edit') return;
        
        if (actionKeys.includes(key)) {
            get().setAction(keyToActionType(key));
            return;
        }

        if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(parseInt(key))) {
            const index = parseInt(key, 10);
            const colorIndex = index === 0 ? 9 : index - 1; // map '0' to index 9
            if (get().patternState.colors.length > colorIndex) {
                get().setSelectedColor(colorIndex);
            }
            return;
        }

        switch (key) {
            case 'v':
                set((state) => ({ mirrorVertical: !state.mirrorVertical }));
                break;
            case 'h':
                set((state) => ({ mirrorHorizontal: !state.mirrorHorizontal }));
                break;
            case 't':
                set((state) => ({ toggleStitch: !state.toggleStitch }));
                break;
            default:
                break;
        }
    },
    changeName: (name: string) => {
        // Save current state to history before modification
        get().addPatternStateToHistory(get().patternState);
        set((state) => ({
            patternState: {
                ...state.patternState,
                name: name
            }
        }));
    },
});export interface PatternSlice {
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
    savePattern: (pattern: IPattern, ignoreHistory?: boolean) => void
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
    changeName: (name: string) => void
}

export const fillRowLeft = (r: IPatternCell[], row: number, col: number, selectedAction: ACTION_TYPES, selectedColorIndex: number, toggleStitch: boolean): IPatternCell[] => {
    let result = [...r]

    for (let index = col; index >= 0; index--) {
        const cell = result[index]

        if (
            (selectedAction === ACTION_TYPES.COLOR && cell.c !== r[col].c)
            ||
            (selectedAction !== ACTION_TYPES.COLOR && selectedAction !== ACTION_TYPES.NONE && cell.t !== CELL_TYPE.EMPTY)
            || 
            (selectedAction === ACTION_TYPES.NONE && cell.t === CELL_TYPE.EMPTY) 
            ) return result
        result[index] = getNewCell(cell, selectedAction, selectedColorIndex, false, toggleStitch)
    }
    return result
};

export const fillRowRight = (r: IPatternCell[], row: number, col: number, selectedAction: ACTION_TYPES, selectedColorIndex: number, toggleStitch: boolean): IPatternCell[] => {
    let result = [...r]
    
    for (let index = col; index < r.length; index++) {
        const cell = result[index]
        if (
            (selectedAction === ACTION_TYPES.COLOR && cell.c !== r[col].c)
            ||
            (selectedAction !== ACTION_TYPES.COLOR && selectedAction !== ACTION_TYPES.NONE && cell.t !== CELL_TYPE.EMPTY)
            || 
            (selectedAction === ACTION_TYPES.NONE && cell.t === CELL_TYPE.EMPTY)
            ) return result
        result[index] = getNewCell(cell, selectedAction, selectedColorIndex, false, toggleStitch)
    }
    return result
}

