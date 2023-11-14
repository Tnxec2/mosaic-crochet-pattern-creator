import React, { FC, createContext, useState } from 'react'
import { IPatternCell } from '../model/patterncell.model'
import { ACTION_TYPES } from '../model/actiontype.enum'
import {
    BACKGROUND_COLOR,
    DEFAULT_COLOR,
    DEFAULT_COLOR_2,
    KEY_STORAGE
} from '../model/constats'
import { loadPattern } from '../services/file.service'
import { useToPng } from '@hugocxl/react-to-image'
import { CELL_TYPE } from '../model/patterntype.enum'

export interface IPattern {
    pattern: IPatternCell[][]
    colors: string[]
    selectedColorIndex: number
    selectedAction: ACTION_TYPES
    scaleFactor: number
    saved: boolean
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
    saved: true
}

interface IPatternContext {
    patternState: IPattern
    savePattern: (pattern: IPattern) => void
    newPattern: () => void
    getCellColor: (row: number, col: number) => string
    showOpenFileDialog: boolean
    setShowOpenFileDialog: React.Dispatch<React.SetStateAction<boolean>>
    showCellStitchType: boolean
    setShowCellStichType: React.Dispatch<React.SetStateAction<boolean>>
    convertToPng: () => void
}

const initialState: IPatternContext = {
    patternState: initialPattern,
    savePattern: (pattern: IPattern) => {},
    newPattern: () => {},
    setShowOpenFileDialog: () => {},
    showOpenFileDialog: false,
    setShowCellStichType: () => {},
    showCellStitchType: true,
    getCellColor: (row: number, col: number) => {
        return ''
    },
    convertToPng: () => {}
}

interface IProps {
    children: any
}

const PatternContext = createContext(initialState)

const PatternContextProvider: FC<IProps> = (props) => {
    const [patternState, setPatternState] = useState<IPattern>(loadPattern())
    const [showOpenFileDialog, setShowOpenFileDialog] = useState(false)
    const [showCellStitchType, setShowCellStichType] = useState(true)

    const savePattern = (pattern: IPattern) => {
        pattern.saved = false
        localStorage.setItem(KEY_STORAGE, JSON.stringify(pattern))
        setPatternState(pattern)
    }

    const newPattern = () => {
        savePattern(initialPattern)
    }

    const [_, convertToPng] = useToPng<HTMLDivElement>({
        selector: '#pattern',
        quality: 1,
        backgroundColor: '#fff',
        skipAutoScale: true,
        pixelRatio: 1,
        onSuccess: (data) => {
            const link = document.createElement('a')
            link.download = 'pattern.png'
            link.href = data
            link.click()
        }
    })

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

    const value = {
        patternState,
        savePattern,
        getCellColor,
        newPattern,
        showOpenFileDialog,
        setShowOpenFileDialog,
        convertToPng,
        showCellStitchType,
        setShowCellStichType
    }

    return (
        <PatternContext.Provider value={value}>
            {props.children}
        </PatternContext.Provider>
    )
}

export { PatternContextProvider, PatternContext, initialPattern }
