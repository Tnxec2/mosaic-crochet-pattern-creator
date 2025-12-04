import { StateCreator } from 'zustand';
import { IPattern } from '.';
import { UNDO_LIMIT } from '../model/constats';
import { CopyBufferSlice } from './copyBufferSlice';
import { PatternSlice } from './patternSlice';
import { VieboxSlice } from './viewBoxSlice';

// New slice for undo/redo history
export const createHistorySlice: StateCreator<
    PatternSlice & VieboxSlice & CopyBufferSlice & HistorySlice, [], [], HistorySlice
> = (set, get) => ({
    past: [],
    future: [],
    undo: () => {
        const { past, patternState, future } = get();
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        set((state) => ({
            ...state,
            patternState: previous,
            past: newPast,
            future: [patternState, ...future],
        }), false); // 'undo' name for devtools and to prevent re-recording
    },
    redo: () => {
        const { past, patternState, future } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set((state) => ({
            ...state,
            patternState: next,
            past: [...past, patternState],
            future: newFuture,
        }), false); // 'redo' name for devtools and to prevent re-recording
    },
    clearHistory: () => {
        set((state) => ({
            ...state,
            past: [],
            future: [],
        }), false); // 'clearHistory' name for devtools and to prevent re-recording
    },
    addPatternStateToHistory: (stateToSave: IPattern) => {
        const { past } = JSON.parse(JSON.stringify(get())); // Deep copy to avoid reference issues

        set((state) => ({
            ...state,
            past: [...(past.length >= UNDO_LIMIT ? past.slice(1) : past), stateToSave],
            future: [], // Clear future when a new action is performed
        }), false); // Name for devtools
    },
});// New interface for history state

export interface HistorySlice {
    past: IPattern[]
    future: IPattern[]
    undo: () => void
    redo: () => void
    clearHistory: () => void
    addPatternStateToHistory: (stateToSave: IPattern) => void
}

