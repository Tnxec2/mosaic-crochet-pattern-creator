import { FC, MouseEvent, useCallback, useContext, useMemo, useState, WheelEvent } from 'react'
import { PatternContext } from '../../../context'
import { Card, Form, InputGroup } from 'react-bootstrap'
import '../pattern.css'
import { ACTION_TYPES } from '../../../model/actiontype.enum'
import { DropDown, MenuItemDivider } from '../dropdown'
import { PatternHeaderComponent } from './pattern.header'
import { PatternRowHeaderComponent } from './pattern.rowheader'
import { PatternRowComponent } from './pattern.row'
import { HoldButton } from './holdbutton'
import { VIEWBOX_MIN_SIZE } from '../../../model/constats'
import { saveViewBoxDebounced } from '../../../services/file.service'

export type TDropDownPos = {
    row: number
    col: number
    x: number
    y: number
    opened: boolean
}

export type TVIEWBOX_SIZE = {
    row: number,
    col: number,
    wx: number,
    wy: number
}

export const PatternWindowComponent: FC = () => {
    const {
        patternState,
        savePattern,
        addColumn,
        addRow,
        fillColumn,
        deleteColumn,
        deleteRow,
        fillRow,
        fillRight,
        fillLeft,
    } = useContext(PatternContext)

    const [pos, setPos] = useState<TVIEWBOX_SIZE>({
        row: 0,
        col: 0,
        wx: 30,
        wy: 20,
    })

    const onUp = useCallback(() => {

        setPos((old) => {
            const newState = { ...old, row: Math.max(0, old.row - 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [])

    const onDown = useCallback(() => {
        setPos((old) => {
            const newState = { ...old, row: Math.min(patternState.pattern.length - pos.wy - 1, old.row + 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern.length, pos.wy])

    const onLeft = useCallback(() => {
        setPos((old) => {
            const newState = { ...old, col: Math.max(0, old.col - 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [])

    const onRight = useCallback(() => {
        setPos((old) => {
            const newState = { ...old, col: Math.min(patternState.pattern[0].length - pos.wx - 1, old.col + 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern, pos.wx])

    const onShrinkWidth = useCallback(() => {
        setPos((old) => {
            const newState = { ...old, wx: Math.max(VIEWBOX_MIN_SIZE, old.wx - 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [])

    const onGrowWidth = useCallback(() => {
        setPos((old) => {
            const newState = { ...old, wx: Math.min(patternState.pattern[0].length, old.wx + 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern])

    const onShrinkHeight = useCallback(() => {
        setPos((old) => {
            const newState = { ...old, wy: Math.max(VIEWBOX_MIN_SIZE, old.wy - 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [])

    const onGrowHeight = useCallback(() => {
        setPos((old) => {
            const newState = { ...old, wy: Math.min(patternState.pattern.length, old.wy + 1) }
            saveViewBoxDebounced(newState)
            return newState
        })
    }, [patternState.pattern.length])

    const handleOnWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
        const { deltaY, shiftKey } = e

        if (shiftKey) {
            if (deltaY > 0) {
                onRight()
            } else {
                onLeft()
            }
        } else {
            if (deltaY > 0) {
                onDown()
            } else {
                onUp()
            }
        }
    }, [onDown, onUp, onRight, onLeft])

    const [dropDownPos, setDropDownPos] = useState<TDropDownPos>({
        row: 0,
        col: 0,
        x: 0,
        y: 0,
        opened: false
    })

    const [dropDownPosPatternCell, setDropDownPosPatternCell] = useState<TDropDownPos>({
        row: 0,
        col: 0,
        x: 0,
        y: 0,
        opened: false
    })

    const closeDropDown = useCallback((e?: MouseEvent<HTMLLIElement>) => {
        setDropDownPos({ row: -1, col: -1, x: e?.screenX || 0, y: e?.screenY || 0, opened: false })
        e?.stopPropagation()
    }, [])

    const dropDownCell = useMemo(() =>
        <DropDown
            x={dropDownPosPatternCell.x}
            y={dropDownPosPatternCell.y}
            onclose={() => setDropDownPosPatternCell({ row: -1, col: -1, x: -1, y: -1, opened: false })}
            menu={[
                { name: `Cell ${patternState.pattern[0].length - dropDownPosPatternCell.col}:${patternState.pattern.length - dropDownPosPatternCell.row}` },
                MenuItemDivider,
                {
                    name: '➡️ fill right',
                    onClick: () =>
                        fillRight(dropDownPosPatternCell.row, dropDownPosPatternCell.col),
                    action: patternState.selectedAction,
                    color: patternState.colors[patternState.selectedColorIndex],
                },
                {
                    name: '⬅️ fill left',
                    onClick: () =>
                        fillLeft(dropDownPosPatternCell.row, dropDownPosPatternCell.col),
                    action: patternState.selectedAction,
                    color: patternState.colors[patternState.selectedColorIndex],
                },
                MenuItemDivider,
                { name: 'change action' },
                ...(Object.values(ACTION_TYPES)
                    .filter(action => action !== patternState.selectedAction)
                    .map((value) => {
                        return {
                            name: value,
                            action: value,
                            color: patternState.colors[patternState.selectedColorIndex],
                            onClick: () => savePattern({ ...patternState, selectedAction: value })
                        }
                    })),
                MenuItemDivider,
                { name: 'change color' },
                ...(patternState.colors
                    .filter((color, index) => index !== patternState.selectedColorIndex)
                    .map((color) => {
                        let colorIndex = patternState.colors.indexOf(color)
                        return {
                            name: `Color ${colorIndex + 1}`,
                            action: ACTION_TYPES.COLOR,
                            color: color,
                            onClick: () => savePattern({ ...patternState, selectedColorIndex: colorIndex })
                        }
                    })
                ),

            ]}
        />, [dropDownPosPatternCell.col, dropDownPosPatternCell.row, dropDownPosPatternCell.x, dropDownPosPatternCell.y, fillLeft, fillRight, patternState, savePattern])

    const dropDownRow = useMemo(() =>
        <DropDown
            x={dropDownPos.x}
            y={dropDownPos.y}
            onclose={(e) => closeDropDown(e)}
            menu={[
                { name: `Row ${patternState.pattern.length - dropDownPos.row}` },
                MenuItemDivider,
                {
                    name: '➕ add row',
                    onClick: () =>
                        addRow(dropDownPos.row)
                },
                {
                    name: '❌ delete row',
                    onClick: () =>
                        deleteRow(dropDownPos.row)
                },
                MenuItemDivider,
                {
                    name: 'row fill',
                    onClick: () =>
                        fillRow(dropDownPos.row),
                    action: patternState.selectedAction,
                    color: patternState
                        .colors[
                        patternState
                            .selectedColorIndex
                    ]
                }
            ]}
        />, [dropDownPos.x, dropDownPos.y, dropDownPos.row, patternState.pattern.length, patternState.selectedAction, patternState.colors, patternState.selectedColorIndex, closeDropDown, addRow, deleteRow, fillRow])

    const dropDownColumn = useMemo(() =>
        <DropDown
            x={dropDownPos.x}
            y={dropDownPos.y}
            onclose={(e) => closeDropDown(e)}
            menu={[
                { name: `Column ${patternState.pattern[0].length - dropDownPos.col}` },
                MenuItemDivider,
                {
                    name: '➕ add col',
                    onClick: () =>
                        addColumn(dropDownPos.col)
                },
                {
                    name: '❌ delete col',
                    onClick: () =>
                        deleteColumn(dropDownPos.col)
                },
                MenuItemDivider,
                {
                    name: 'col fill',
                    onClick: () =>
                        fillColumn(dropDownPos.col),
                    action: patternState.selectedAction,
                    color: patternState
                        .colors[
                        patternState
                            .selectedColorIndex
                    ]
                }
            ]}
        />, [dropDownPos.x, dropDownPos.y, dropDownPos.col, patternState.pattern, patternState.selectedAction, patternState.colors, patternState.selectedColorIndex, closeDropDown, addColumn, deleteColumn, fillColumn])




    return (
        <>
            {dropDownPos?.opened && dropDownPos.row === -1 && dropDownColumn}
            {dropDownPos?.opened && dropDownPos.col === -1 && dropDownRow}
            {dropDownPosPatternCell?.opened && dropDownCell}

            <Card className="h-100">
                <PatternHeaderComponent />
                <Card.Body className="pattern-container">
                    <div className='mb-3'>
                        <InputGroup>
                            <InputGroup.Text><strong>Viewbox</strong></InputGroup.Text>
                            <InputGroup.Text>width</InputGroup.Text>
                            <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern[0].length} value={pos.wx} onChange={(e) => setPos((old) => { return { ...old, wx: Number(e.target.value) } })} />
                            <HoldButton className='btn btn-outline-danger' onFire={onShrinkWidth}>-</HoldButton>
                            <HoldButton className='btn btn-outline-success' onFire={onGrowWidth}>+</HoldButton>

                            <InputGroup.Text>✖️</InputGroup.Text>
                            <InputGroup.Text>height</InputGroup.Text>
                            <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern.length} value={pos.wy} onChange={(e) => setPos((old) => { return { ...old, wy: Number(e.target.value) } })} />
                            <HoldButton className='btn btn-outline-danger' onFire={onShrinkHeight}>-</HoldButton>
                            <HoldButton className='btn btn-outline-success' onFire={onGrowHeight}>+</HoldButton>
                        </InputGroup>
                    </div>
                    <div
                        className="noselect"
                        id="pattern"
                        style={{
                            transform: `scale(${patternState.scaleFactor})`,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <HoldButton className='btn-outline-secondary mb-1' onFire={onUp}>🔼</HoldButton>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflow: 'auto'
                        }}>
                            <HoldButton className='btn-outline-secondary me-1' onFire={onLeft}>◀️</HoldButton>

                            <div onWheel={handleOnWheel} style={{ overflow: 'auto', overscrollBehavior: 'contain' }}>
                                <PatternRowHeaderComponent setDropDownPos={setDropDownPos} pos={pos} />
                                {patternState.pattern
                                    .filter((_, rowIndex) => rowIndex >= pos.row && rowIndex <= pos.row + pos.wy)
                                    .map((row, rowIndex) => (
                                        <PatternRowComponent
                                            key={`row-${rowIndex + pos.row}`}
                                            row={row}
                                            rowIndex={rowIndex + pos.row}
                                            dropDownPosPatternCell={dropDownPosPatternCell}
                                            setDropDownPos={setDropDownPos}
                                            setDropDownPosPatternCell={setDropDownPosPatternCell}
                                            pos={pos}
                                        />
                                    ))}
                                <PatternRowHeaderComponent setDropDownPos={setDropDownPos} pos={pos} />
                            </div>
                            <HoldButton className='btn-outline-secondary ms-1' onFire={onRight}>▶️</HoldButton>
                        </div>
                        <HoldButton className='btn-outline-secondary mt-1' onFire={onDown}>🔽</HoldButton>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
