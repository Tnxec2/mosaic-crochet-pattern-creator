import { StateCreator } from 'zustand';
import { HistorySlice } from './historySlice';
import { VieboxSlice } from './viewBoxSlice';
import { PatternSlice } from './patternSlice';
import { IPatternGrid } from '../model/patterncell.model';
import { TCellCoords } from '../model/patterntype.enum';

export const createCopyBufferSlice: StateCreator<
    CopyBufferSlice & PatternSlice & VieboxSlice & HistorySlice, [], [], CopyBufferSlice
> = (set, get) => ({
    bufferdata: [],
    paste: (coords: TCellCoords, full?: boolean) => {
        if (get().bufferdata.length > 0) {
            // Save current state to history before modification
            get().addPatternStateToHistory(get().patternState);

            const newPat = JSON.parse(JSON.stringify(get().patternState.pattern)) as IPatternGrid;
            const bufferWidth = get().bufferdata[0].length;
            const bufferHeight = get().bufferdata.length;
            const patternHeight = newPat.length;
            const patternWidth = newPat[0].length;

            for (let row = 0; row < bufferHeight; row++) {
                for (let col = 0; col < bufferWidth; col++) {
                    const targetRow = coords.row + row;
                    const targetCol = coords.col + col;
                    if (targetRow < patternHeight && targetCol < patternWidth) {
                        if (full) newPat[targetRow][targetCol] = get().bufferdata[row][col];
                        else newPat[targetRow][targetCol].t = get().bufferdata[row][col].t;
                    }
                }
            }
            set((state) => ({ patternState: { ...state.patternState, pattern: newPat } }));
        }
    },
    startCopy: { row: 0, col: 0 },
    endCopy: { row: 0, col: 0 },
    setStart: (coords: TCellCoords) => set((state) => ({ startCopy: coords })),
    setEnd: (coords: TCellCoords) => {
        let data = get().patternState.pattern.filter((r, rowIndex) => between(rowIndex, get().startCopy.row, coords.row)
        ).map((r) => r.filter((c, colIndex) => between(colIndex, get().startCopy.col, coords.col)));
        set((state) => ({ ...state, endCopy: coords, bufferdata: data }));
    },
    showBufferData: false,
    toggleShowBufferData: () => set((state) => ({ showBufferData: !state.showBufferData }))
});
function between(value: number, first: number, last: number) {
    let lower = Math.min(first, last), upper = Math.max(first, last);
    return value >= lower && value <= upper;
}export interface CopyBufferSlice {
    bufferdata: IPatternGrid
    paste: (coords: TCellCoords, full?: boolean) => void
    startCopy: TCellCoords
    endCopy: TCellCoords
    setStart: (coords: TCellCoords) => void
    setEnd: (coords: TCellCoords) => void
    showBufferData: boolean
    toggleShowBufferData: () => void
}

