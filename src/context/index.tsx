import { initialPattern, IPatternCell, IPatternGrid, IPatternGrid_Old } from '../model/patterncell.model'
import { ACTION_TYPES } from '../model/actiontype.enum'
import {
    KEY_STORAGE_OLD,
    KEY_STORAGE_ZUSTAND,
    UNKNOWN_NAME} from '../model/constats'


import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { mug } from '../sampledata/mug'
import { CopyBufferSlice, createCopyBufferSlice } from './copyBufferSlice'
import { createPatternSlice, PatternSlice } from './patternSlice'
import { createViewBoxSlice, VieboxSlice } from './viewBoxSlice'
import { createHistorySlice, HistorySlice } from './historySlice'


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

// Combine all slices and export the store
export const useStore = create<PatternSlice & VieboxSlice & CopyBufferSlice & HistorySlice>()(
    persist(
        devtools((...a) => ({
            ...createPatternSlice(...a),
            ...createViewBoxSlice(...a),
            ...createCopyBufferSlice(...a),
            ...createHistorySlice(...a), // Add the history slice
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