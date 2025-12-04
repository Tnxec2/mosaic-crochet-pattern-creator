import { StateCreator } from 'zustand';
import { HistorySlice } from './historySlice';
import { DEFAULT_VIEWBOX, VIEWBOX_MIN_SIZE } from '../model/constats';
import { TVIEWBOX_SIZE } from '../model/patterntype.enum';
import { PatternSlice } from './patternSlice';
import { IPatternGrid } from '../model/patterncell.model';

export const createViewBoxSlice: StateCreator<
    PatternSlice & VieboxSlice & HistorySlice, [], [], VieboxSlice
> = (set, get) => ({
    viewBox: DEFAULT_VIEWBOX,
    viewBox2: DEFAULT_VIEWBOX,
    splittedViewBox: false,
    toggleSplittedViewBox: () => set((state) => ({ splittedViewBox: !state.splittedViewBox })),
    setViewBox: (viewBox: TVIEWBOX_SIZE, viewBoxNumber?: number) => set((state) => {
        if (viewBoxNumber === 2) {
            return { viewBox2: viewBox };
        } else {
            return { viewBox: viewBox };
        }
    }),

    gotoViewBox: (row: number, col: number, viewBoxNumber?: number) => set((state) => {
        return viewBoxNumber === 2 ?
            {
                viewBox2: {
                    ...state.viewBox2,
                    row: Math.max(0, Math.min(get().patternState.pattern.length - 1, Math.max(0, row))),
                    col: Math.max(0, Math.min(get().patternState.pattern[0].length - 1, Math.max(0, col)))
                }
            }
            :
            {
                viewBox: {
                    ...state.viewBox,
                    row: Math.max(0, Math.min(get().patternState.pattern.length - 1, Math.max(0, row))),
                    col: Math.max(0, Math.min(get().patternState.pattern[0].length - 1, Math.max(0, col)))
                }
            };
    }),
    gotoViewBoxUp: (step: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber);
        let newRow = Math.max(0, box.row - step);
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, row: newRow } }
            : { viewBox: { ...box, row: newRow } };
    }),
    gotoViewBoxDown: (step: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber);
        let newRow = box.row + step;
        let min = Math.max(0, get().patternState.pattern.length - box.wy);
        newRow = Math.min(min, newRow);

        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, row: newRow } }
            : { viewBox: { ...box, row: newRow } };
    }),
    gotoViewBoxLeft: (step: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber);
        let newCol = Math.max(0, box.col - step);
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, col: newCol } }
            : { viewBox: { ...box, col: newCol } };
    }),
    gotoViewBoxRight: (step: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber);
        let newCol = box.col + step;
        let min = Math.max(0, get().patternState.pattern[0].length - box.wx);
        newCol = Math.min(min, newCol);
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, col: newCol } }
            : { viewBox: { ...box, col: newCol } };
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
        let box = getViewBox(state, viewBoxNumber);
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, wx: Math.max(VIEWBOX_MIN_SIZE, width) } }
            : { viewBox: { ...box, wx: Math.max(VIEWBOX_MIN_SIZE, width) } };
    }),
    onChageViewBoxHeight: (height: number, viewBoxNumber?: number) => set((state) => {
        let box = getViewBox(state, viewBoxNumber);
        return viewBoxNumber === 2 ?
            { viewBox2: { ...box, wy: Math.max(VIEWBOX_MIN_SIZE, height) } }
            : { viewBox: { ...box, wy: Math.max(VIEWBOX_MIN_SIZE, height) } };
    }),
});export interface VieboxSlice {
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
export const getViewBox = (state: VieboxSlice, viewBoxNumber?: number): TVIEWBOX_SIZE => {
    if (viewBoxNumber === 2) {
        return state.viewBox2
    } else {
        return state.viewBox
    }
}

