import { FC, MouseEvent, useCallback, useMemo, useState, WheelEvent } from 'react'

import { Card } from 'react-bootstrap'
import '../pattern.css'
import { ACTION_TYPES } from '../../../model/actiontype.enum'
import { DropDown, MenuItemDivider } from '../dropdown'
import { PatternHeaderComponent } from '../pattern.header'
import { PatternRowHeaderWindowedComponent } from './pattern.rowheader'
import { PatternRowWindowedComponent } from './pattern.row'
import { HoldButton } from './holdbutton'
import { useStore } from '../../../context'
import { TDropDownPos } from '../../../model/patterntype.enum'
import { ViewBoxSizeComponent } from './viewbox.size'


const SCROLL_STEP = 5;

export const PatternWindowedComponent: FC = () => {
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
        viewBox,
        gotoViewBoxUp,
        gotoViewBoxDown,
        gotoViewBoxLeft,
        gotoViewBoxRight,
    } = useStore()

    const handleOnWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
        e.stopPropagation()

        const { deltaY, shiftKey } = e

        
        if (shiftKey) {
            if (deltaY > 0) {
                gotoViewBoxRight(SCROLL_STEP)
            } else {
                gotoViewBoxLeft(SCROLL_STEP)
            }
        } else {
            if (deltaY > 0) {
                gotoViewBoxDown(SCROLL_STEP)
            } else {
                gotoViewBoxUp(SCROLL_STEP)
            }
        }
    }, [gotoViewBoxDown, gotoViewBoxLeft, gotoViewBoxRight, gotoViewBoxUp])

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
                { name: `Column ${patternState.pattern[0].length - dropDownPos.col - viewBox.col}` },
                MenuItemDivider,
                {
                    name: '➕ add col',
                    onClick: () =>
                        addColumn(dropDownPos.col+viewBox.col)
                },
                {
                    name: '❌ delete col',
                    onClick: () =>
                        deleteColumn(dropDownPos.col+viewBox.col)
                },
                MenuItemDivider,
                {
                    name: 'col fill',
                    onClick: () =>
                        fillColumn(dropDownPos.col+viewBox.col),
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
                    <ViewBoxSizeComponent />
                    <div
                        className="noselect"
                        id="pattern"
                        style={{
                            transform: `scale(${patternState.scaleFactor})`,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <HoldButton className='btn-outline-secondary mb-1' onFire={() => gotoViewBoxUp(1)}>🔼</HoldButton>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflow: 'auto'
                        }}>
                            <HoldButton className='btn-outline-secondary me-1' onFire={() => gotoViewBoxLeft(1)}>◀️</HoldButton>

                            <div onWheel={handleOnWheel} style={{ overflow: 'auto', overscrollBehavior: 'contain' }}>
                                <PatternRowHeaderWindowedComponent setDropDownPos={setDropDownPos} pos={viewBox} />
                                {patternState.pattern
                                    .filter((_, rowIndex) => rowIndex >= viewBox.row && rowIndex < viewBox.row + viewBox.wy)
                                    .map((row, rowIndex) => (
                                        <PatternRowWindowedComponent
                                            key={`row-${rowIndex + viewBox.row}`}
                                            row={row}
                                            rowIndex={rowIndex + viewBox.row}
                                            dropDownPosPatternCell={dropDownPosPatternCell}
                                            setDropDownPos={setDropDownPos}
                                            setDropDownPosPatternCell={setDropDownPosPatternCell}
                                            pos={viewBox}
                                        />
                                    ))}
                                <PatternRowHeaderWindowedComponent setDropDownPos={setDropDownPos} pos={viewBox} />
                            </div>
                            <HoldButton className='btn-outline-secondary ms-1' onFire={() => gotoViewBoxRight(1)}>▶️</HoldButton>
                        </div>
                        <HoldButton className='btn-outline-secondary mt-1' onFire={() => gotoViewBoxDown(1)}>🔽</HoldButton>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
