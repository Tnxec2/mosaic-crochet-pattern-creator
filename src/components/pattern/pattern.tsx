import { FC, MouseEvent, useContext, useState } from 'react'
import { PatternContext } from '../../context'
import { Card, InputGroup } from 'react-bootstrap'
import './pattern.css'
import { CELL_TYPE } from '../../model/patterntype.enum'
import { IPatternCell } from '../../model/patterncell.model'
import { ACTION_TYPES } from '../../model/actiontype.enum'
import { DropDown } from './dropdown'
import { PatterCellComponent } from './pattern_cell'
import { ScaleFactor } from '../shared/scalefactor'
import { PatternName } from '../shared/patternname'

type TDropDownPos = {
    row?: number
    col?: number
    opened?: boolean
}

export const PatternComponent: FC = () => {
    const {
        patternState,
        savePattern,
        getCellColor,
        showCellStitchType,
        setShowCellStitchType,
        mirrorVertical,
        mirrorHorizontal,
        toggleStitch
    } = useContext(PatternContext)


    const [dropDownPos, setDropDownPos] = useState<TDropDownPos>({
        row: 0,
        col: 0,
        opened: false
    })

    const handleClick = (row: number, col: number, mouseOver?: boolean) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r, rowI) =>
                rowI === row || (mirrorHorizontal && rowI === patternState.pattern.length - row - 1)
                    ? r.map((c, colI) =>
                          colI === col || (mirrorVertical && colI === r.length - col - 1) ? getnewcell(c, mouseOver) : c
                      )
                    : r
            )
        })
    }

    const handleMouseOver = (
        e: MouseEvent<HTMLElement>,
        row: number,
        col: number
    ) => {
        if (e.stopPropagation) e.stopPropagation()
        if (e.preventDefault) e.preventDefault()

        if (e.buttons === 1) {
            handleClick(row, col, true)
        }
    }

    const getnewcell = (c: IPatternCell, mouseOver?: boolean): IPatternCell => {
        switch (patternState.selectedAction) {
            case ACTION_TYPES.COLOR:
                return { ...c, colorindex: patternState.selectedColorIndex }
            case ACTION_TYPES.X:
                return {
                    ...c,
                    type: mouseOver || !toggleStitch
                        ? CELL_TYPE.X
                        : c.type === CELL_TYPE.X
                          ? CELL_TYPE.EMPTY
                          : CELL_TYPE.X
                }
            case ACTION_TYPES.L:
                return {
                    ...c,
                    type: mouseOver || !toggleStitch
                        ? CELL_TYPE.L
                        : c.type === CELL_TYPE.L
                          ? CELL_TYPE.EMPTY
                          : CELL_TYPE.L
                }
            case ACTION_TYPES.R:
                return {
                    ...c,
                    type: mouseOver || !toggleStitch
                        ? CELL_TYPE.R
                        : c.type === CELL_TYPE.R
                          ? CELL_TYPE.EMPTY
                          : CELL_TYPE.R
                }
            case ACTION_TYPES.LR:
                return {
                    ...c,
                    type: mouseOver || !toggleStitch
                        ? CELL_TYPE.LR
                        : c.type === CELL_TYPE.LR
                          ? CELL_TYPE.EMPTY
                          : CELL_TYPE.LR
                }
            case ACTION_TYPES.XR:
                return {
                    ...c,
                    type: mouseOver || !toggleStitch
                        ? CELL_TYPE.XR
                        : c.type === CELL_TYPE.XR
                          ? CELL_TYPE.EMPTY
                          : CELL_TYPE.XR
                }
            case ACTION_TYPES.LX:
                return {
                    ...c,
                    type: mouseOver || !toggleStitch
                        ? CELL_TYPE.LX
                        : c.type === CELL_TYPE.LX
                          ? CELL_TYPE.EMPTY
                          : CELL_TYPE.LX
                }
            case ACTION_TYPES.LXR:
                return {
                    ...c,
                    type: mouseOver || !toggleStitch
                        ? CELL_TYPE.LXR
                        : c.type === CELL_TYPE.LXR
                          ? CELL_TYPE.EMPTY
                          : CELL_TYPE.LXR
                }
            case ACTION_TYPES.NONE:
                return { ...c, type: CELL_TYPE.EMPTY }
            default:
                return { ...c }
        }
    }

    const addCol = (at: number) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r) => [
                ...r.slice(0, at + 1),
                {
                    colorindex: patternState.selectedColorIndex,
                    type: CELL_TYPE.EMPTY
                },
                ...r.slice(at + 1)
            ])
        })
    }

    const deleteCol = (col: number) => {
        if (!window.confirm('Do you really want to delete whole column?'))
            return
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r) =>
                r.filter((_c, i) => i !== col)
            )
        })
    }

    const deleteRow = (row: number) => {
        if (!window.confirm('Do you really want to delete whole row?')) return
        savePattern({
            ...patternState,
            pattern: patternState.pattern.filter((_r, i) => i !== row)
        })
    }

    const fillCol = (col: number) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r) =>
                r.map((c, i) => (i !== col ? c : getnewcell(c)))
            )
        })
    }

    const fillRow = (row: number) => {
        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r, i) =>
                i !== row ? r : r.map((c) => getnewcell(c))
            )
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

    const closeDropDown = () => {
        setDropDownPos({ row: -1, col: -1, opened: false })
    }



    return (
        <>
            <Card className="h-100">
                <Card.Header>
                    <Card.Title>
                        Pattern
                    
                        <div className="form-check form-switch float-end">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                checked={showCellStitchType}
                                onChange={(e) => {
                                    setShowCellStitchType(e.target.checked)
                                }}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="flexSwitchCheckDefault"
                            >
                                show stitch type
                            </label>
                        </div>
                    </Card.Title>
                        <InputGroup className="mb-3">
                            <PatternName />
                            <ScaleFactor />
                        </InputGroup>
                </Card.Header>
                <Card.Body className="pattern-container">
                    <div
                        className="noselect"
                        id="pattern"
                        style={{
                            transform: `scale(${patternState.scaleFactor})`
                        }}
                    >
                        <div className="r">
                            <div className="cell empty">&nbsp;</div>
                            {patternState.pattern[0].map((col, colIndex) => (
                                <div
                                    key={`row0-${colIndex}`}
                                    className="cell"
                                    onClick={() => {
                                        setDropDownPos({
                                            row: -1,
                                            col: colIndex,
                                            opened: true
                                        })
                                    }}
                                >
                                    {patternState.pattern[0].length - colIndex}
                                    {dropDownPos?.opened &&
                                        dropDownPos.row === -1 &&
                                        dropDownPos.col === colIndex && (
                                            <DropDown
                                                onclose={() => closeDropDown()}
                                                menu={[
                                                    {
                                                        name: '➕ add col',
                                                        onClick: () =>
                                                            addCol(colIndex)
                                                    },
                                                    {
                                                        name: '❌ delete col',
                                                        onClick: () =>
                                                            deleteCol(colIndex)
                                                    },
                                                    { name: '', divider: true },
                                                    {
                                                        name: 'col fill',
                                                        onClick: () =>
                                                            fillCol(colIndex),
                                                        action: patternState.selectedAction,
                                                        color: patternState
                                                            .colors[
                                                            patternState
                                                                .selectedColorIndex
                                                        ]
                                                    }
                                                ]}
                                            />
                                        )}
                                </div>
                            ))}
                            <div className="cell empty">&nbsp;</div>
                        </div>
                        {patternState.pattern.map((row, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="r">
                                <div
                                    key={`col0-${rowIndex}`}
                                    className="cell"
                                    onClick={() => {
                                        setDropDownPos({
                                            row: rowIndex,
                                            col: 0,
                                            opened: true
                                        })
                                    }}
                                >
                                    {patternState.pattern.length - rowIndex}
                                    {dropDownPos?.opened &&
                                        dropDownPos.row === rowIndex &&
                                        dropDownPos.col === 0 && (
                                            <DropDown
                                                onclose={() => closeDropDown()}
                                                menu={[
                                                    {
                                                        name: '➕ add row',
                                                        onClick: () =>
                                                            addRow(rowIndex)
                                                    },
                                                    {
                                                        name: '❌ delete row',
                                                        onClick: () =>
                                                            deleteRow(rowIndex)
                                                    },
                                                    { name: '', divider: true },
                                                    {
                                                        name: 'row fill',
                                                        onClick: () =>
                                                            fillRow(rowIndex),
                                                        action: patternState.selectedAction,
                                                        color: patternState
                                                            .colors[
                                                            patternState
                                                                .selectedColorIndex
                                                        ]
                                                    }
                                                ]}
                                            />
                                        )}
                                </div>
                                {row.map((col, colIndex) => (
                                    <PatterCellComponent
                                        onClick={(e) => {
                                            if (e.stopPropagation)
                                                e.stopPropagation()
                                            if (e.preventDefault)
                                                e.preventDefault()
                                            handleClick(rowIndex, colIndex)
                                        }}
                                        color={getCellColor(rowIndex, colIndex)}
                                        onMouseOver={(e) =>
                                            handleMouseOver(
                                                e,
                                                rowIndex,
                                                colIndex
                                            )
                                        }
                                        key={`col-${colIndex}`}
                                        cell={col}
                                        showCellCrochetType={showCellStitchType}
                                    />
                                ))}
                                <div
                                    key={`colend-${rowIndex}`}
                                    className="cell"
                                    onClick={() => {
                                        setDropDownPos({
                                            row: rowIndex,
                                            col: 9999,
                                            opened: true
                                        })
                                    }}
                                >
                                    {patternState.pattern.length - rowIndex}
                                    {dropDownPos?.opened &&
                                        dropDownPos.row === rowIndex &&
                                        dropDownPos.col === 9999 && (
                                            <DropDown
                                                onclose={() => closeDropDown()}
                                                menu={[
                                                    {
                                                        name: '➕ add row',
                                                        onClick: () =>
                                                            addRow(rowIndex)
                                                    },
                                                    {
                                                        name: '❌ delete row',
                                                        onClick: () =>
                                                            deleteRow(rowIndex)
                                                    },
                                                    { name: '', divider: true },
                                                    {
                                                        name: 'row fill',
                                                        onClick: () =>
                                                            fillRow(rowIndex),
                                                        action: patternState.selectedAction,
                                                        color: patternState
                                                            .colors[
                                                            patternState
                                                                .selectedColorIndex
                                                        ]
                                                    }
                                                ]}
                                            />
                                        )}
                                </div>
                            </div>
                        ))}
                        <div className="r">
                            <div className="cell empty">&nbsp;</div>
                            {patternState.pattern[0].map((col, colIndex) => (
                                <div
                                    key={`rowend-${colIndex}`}
                                    className="cell"
                                    onClick={() => {
                                        setDropDownPos({
                                            row: 99999,
                                            col: colIndex,
                                            opened: true
                                        })
                                    }}
                                >
                                    {patternState.pattern[0].length - colIndex}
                                    {dropDownPos?.opened &&
                                        dropDownPos.row === 99999 &&
                                        dropDownPos.col === colIndex && (
                                            <DropDown
                                                onclose={() => closeDropDown()}
                                                menu={[
                                                    {
                                                        name: '➕ add col',
                                                        onClick: () =>
                                                            addCol(colIndex)
                                                    },
                                                    {
                                                        name: '❌ delete col',
                                                        onClick: () =>
                                                            deleteCol(colIndex)
                                                    },
                                                    { name: '', divider: true },
                                                    {
                                                        name: 'col fill',
                                                        onClick: () =>
                                                            fillCol(colIndex),
                                                        action: patternState.selectedAction,
                                                        color: patternState
                                                            .colors[
                                                            patternState
                                                                .selectedColorIndex
                                                        ]
                                                    }
                                                ]}
                                            />
                                        )}
                                </div>
                            ))}
                            <div className="cell empty">&nbsp;</div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
