import { FC, Fragment, MouseEvent, useCallback, useContext, useState } from 'react'
import { PatternContext } from '../../context'
import { Card, InputGroup } from 'react-bootstrap'
import './pattern.css'
import { ACTION_TYPES } from '../../model/actiontype.enum'
import { DropDown, MenuItemDivider } from './dropdown'
import { PatterCellComponent } from './pattern_cell'
import { ScaleFactor } from '../shared/scalefactor'
import { PatternName } from '../shared/patternname'
import { Help } from './help'

type TDropDownPos = {
    row?: number
    col?: number
    opened?: boolean
}

export const PatternComponent: FC = () => {
    const {
        patternState,
        savePattern,
        addColumn,
        addRow,
        fillColumn,
        getCellColor,
        changeCell,
        deleteColumn,
        deleteRow,
        fillRow,
        fillRight,
        fillLeft,
        showCellStitchType,
        setShowCellStitchType,
    } = useContext(PatternContext)


    const [dropDownPos, setDropDownPos] = useState<TDropDownPos>({
        row: 0,
        col: 0,
        opened: false
    })

    const [dropDownPosPatternCell, setDropDownPosPatternCell] = useState<TDropDownPos>({
        row: 0,
        col: 0,
        opened: false
    })

    const handleClick = useCallback((row: number, col: number, mouseOver: boolean, event: MouseEvent<HTMLElement>) => {
        if (dropDownPosPatternCell.opened) {
            setDropDownPosPatternCell({...dropDownPosPatternCell, opened: false})
            return
        } 
        if (event.ctrlKey){
            if (patternState.selectedAction !== ACTION_TYPES.NONE) setDropDownPosPatternCell({row: row, col: col, opened: true})
            return
        } 
        changeCell(row, col, mouseOver)
    }, [changeCell, dropDownPosPatternCell, patternState.selectedAction])


    const handleMouseOver = useCallback((
        e: MouseEvent<HTMLElement>,
        row: number,
        col: number
    ) => {
        if (e.stopPropagation) e.stopPropagation()
        if (e.preventDefault) e.preventDefault()

        if (e.buttons === 1) {
            handleClick(row, col, true, e)
        }
    }, [handleClick])


    const closeDropDown = useCallback((e?: MouseEvent<HTMLLIElement>) => {
        setDropDownPos({ row: -1, col: -1, opened: false })
        e?.stopPropagation()
    }, [])

    return (
        <>
            <Card className="h-100">
                <Card.Header>
                    <Card.Title>
                        Pattern                        
                        <Help />
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
                            <div className="cell empty rownumber">&nbsp;</div>
                            {patternState.pattern[0].map((col, colIndex) => (
                                <div
                                    key={`row0-${colIndex}`}
                                    className="cell colnumber"
                                    onClick={() => {
                                        setDropDownPos({
                                            row: -1,
                                            col: colIndex,
                                            opened: true
                                        })
                                    }}
                                    title={`${patternState.pattern[0].length - colIndex}`}
                                >
                                    {patternState.pattern[0].length - colIndex}
                                    {dropDownPos?.opened &&
                                        dropDownPos.row === -1 &&
                                        dropDownPos.col === colIndex && (
                                            <DropDown
                                                scaleFactor={patternState.scaleFactor}
                                                onclose={(e) => closeDropDown(e)}
                                                menu={[
                                                    {
                                                        name: '➕ add col',
                                                        onClick: () =>
                                                            addColumn(colIndex)
                                                    },
                                                    {
                                                        name: '❌ delete col',
                                                        onClick: () =>
                                                            deleteColumn(colIndex)
                                                    },
                                                    MenuItemDivider,
                                                    {
                                                        name: 'col fill',
                                                        onClick: () =>
                                                            fillColumn(colIndex),
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
                            <div className="cell empty rownumber">&nbsp;</div>
                        </div>
                        {patternState.pattern.map((row, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="r">
                                <div
                                    key={`col0-${rowIndex}`}
                                    className="cell rownumber"
                                    onClick={() => {
                                        setDropDownPos({
                                            row: rowIndex,
                                            col: 0,
                                            opened: true
                                        })
                                    }}
                                    title={`${patternState.pattern.length - rowIndex}`}
                                >
                                    {patternState.pattern.length - rowIndex}
                                    {dropDownPos?.opened &&
                                        dropDownPos.row === rowIndex &&
                                        dropDownPos.col === 0 && (
                                            <DropDown
                                                scaleFactor={patternState.scaleFactor}
                                                onclose={(e) => closeDropDown(e)}
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
                                                    MenuItemDivider,
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
                                    <Fragment key={`col-${colIndex}`}>
                                    <PatterCellComponent
                                        onClick={(e) => {
                                            if (e.stopPropagation)
                                                e.stopPropagation()
                                            if (e.preventDefault)
                                                e.preventDefault()
                                            handleClick(rowIndex, colIndex, false, e)
                                        }}
                                        color={getCellColor(rowIndex, colIndex)}
                                        onMouseOver={(e) =>
                                            handleMouseOver(
                                                e,
                                                rowIndex,
                                                colIndex
                                            )
                                        }
                                        row={patternState.pattern.length - rowIndex}
                                        col={row.length - colIndex}
                                        cell={col}
                                        showCellCrochetType={showCellStitchType}
                                    >
                                    { dropDownPosPatternCell?.opened && 
                                        dropDownPosPatternCell.row === rowIndex &&
                                        dropDownPosPatternCell.col === colIndex &&(
                                            <DropDown
                                                scaleFactor={patternState.scaleFactor}
                                                onclose={() => setDropDownPosPatternCell({ row: -1, col: -1, opened: false })}
                                                menu={[
                                                    {
                                                        name: '➡️ fill right',
                                                        onClick: () =>
                                                            fillRight(rowIndex, colIndex),
                                                        action: patternState.selectedAction,
                                                        color: patternState.colors[patternState.selectedColorIndex], 
                                                    },
                                                    {
                                                        name: '⬅️ fill left',
                                                        onClick: () =>
                                                            fillLeft(rowIndex, colIndex),
                                                        action: patternState.selectedAction,
                                                        color: patternState.colors[patternState.selectedColorIndex], 
                                                    },
                                                    MenuItemDivider,
                                                    { name: 'change action'},
                                                    ...(Object.values(ACTION_TYPES)
                                                    .filter(action => action !== patternState.selectedAction)
                                                    .map((value) => {
                                                        return { 
                                                            name: value,
                                                            action: value,
                                                            color: patternState.colors[patternState.selectedColorIndex], 
                                                            onClick: () => savePattern({...patternState, selectedAction: value})
                                                        } 
                                                    } )),
                                                    MenuItemDivider,
                                                    { name: 'change color'},
                                                    ...(patternState.colors
                                                        .filter((color, index) => index !== patternState.selectedColorIndex)
                                                        .map((color) => {
                                                            let colorIndex = patternState.colors.indexOf(color)
                                                            return { 
                                                                name: `Color ${colorIndex+1}`,
                                                                action: ACTION_TYPES.COLOR,
                                                                color: color,
                                                                onClick: () => savePattern({...patternState, selectedColorIndex: colorIndex})
                                                            } 
                                                        } )
                                                    ),
                                                
                                                ]}
                                            />
                                        )}
                                        </PatterCellComponent>
                                    </Fragment>
                                ))}
                                    
                                <div
                                    key={`colend-${rowIndex}`}
                                    className="cell rownumber"
                                    onClick={() => {
                                        setDropDownPos({
                                            row: rowIndex,
                                            col: 9999,
                                            opened: true
                                        })
                                    }}
                                    title={`${patternState.pattern.length - rowIndex}`}
                                >
                                    {patternState.pattern.length - rowIndex}
                                    {dropDownPos?.opened &&
                                        dropDownPos.row === rowIndex &&
                                        dropDownPos.col === 9999 && (
                                            <DropDown
                                                scaleFactor={patternState.scaleFactor}
                                                onclose={(e) => closeDropDown(e)}
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
                            <div className="cell empty rownumber">&nbsp;</div>
                            {patternState.pattern[0].map((col, colIndex) => (
                                <div
                                    key={`rowend-${colIndex}`}
                                    className="cell colnumber"
                                    onClick={() => {
                                        setDropDownPos({
                                            row: 99999,
                                            col: colIndex,
                                            opened: true
                                        })
                                    }}
                                    title={`${patternState.pattern[0].length - colIndex}`}
                                >
                                    {patternState.pattern[0].length - colIndex}
                                    {dropDownPos?.opened &&
                                        dropDownPos.row === 99999 &&
                                        dropDownPos.col === colIndex && (
                                            <DropDown
                                                scaleFactor={patternState.scaleFactor}
                                                onclose={(e) => closeDropDown(e)}
                                                menu={[
                                                    {
                                                        name: '➕ add col',
                                                        onClick: () =>
                                                            addColumn(colIndex)
                                                    },
                                                    {
                                                        name: '❌ delete col',
                                                        onClick: () =>
                                                            deleteColumn(colIndex)
                                                    },
                                                    { name: '', divider: true },
                                                    {
                                                        name: 'col fill',
                                                        onClick: () =>
                                                            fillColumn(colIndex),
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
                            <div className="cell empty rownumber">&nbsp;</div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
