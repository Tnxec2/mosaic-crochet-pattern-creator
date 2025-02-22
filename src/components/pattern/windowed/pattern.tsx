import { FC, MouseEvent, useCallback, useMemo, useState, WheelEvent } from 'react'

import { Card, Form, InputGroup } from 'react-bootstrap'
import '../pattern.css'
import { ACTION_TYPES } from '../../../model/actiontype.enum'
import { DropDown, MenuItemDivider } from '../dropdown'
import { PatternHeaderComponent } from '../pattern.header'
import { PatternRowHeaderComponent } from './pattern.rowheader'
import { PatternRowComponent } from './pattern.row'
import { HoldButton } from './holdbutton'
import { VIEWBOX_MIN_SIZE } from '../../../model/constats'
import { useStore } from '../../../context'
import { TDropDownPos } from '../../../model/patterntype.enum'


const SCROLL_STEP = 5;

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
        viewBox,
        gotoViewBoxUp,
        gotoViewBoxDown,
        gotoViewBoxLeft,
        gotoViewBoxRight,
        onShrinkViewBoxWidth,
        onGrowViewBoxWidth,
        onGrowViewBoxHeight,
        onShrinkViewBoxHeight,
        onChageViewBoxWidth,
        onChageViewBoxHeight
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
                            <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern[0].length} value={viewBox.wx}
                                onChange={(e) => { onChageViewBoxWidth(Number(e.target.value)) }} />
                            <HoldButton className='btn btn-outline-danger' onFire={onShrinkViewBoxWidth}>-</HoldButton>
                            <HoldButton className='btn btn-outline-success' onFire={onGrowViewBoxWidth}>+</HoldButton>

                            <InputGroup.Text>✖️</InputGroup.Text>
                            <InputGroup.Text>height</InputGroup.Text>
                            <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern.length} value={viewBox.wy}
                                onChange={(e) => { onChageViewBoxHeight(Number(e.target.value)) }} />
                            <HoldButton className='btn btn-outline-danger' onFire={onShrinkViewBoxHeight}>-</HoldButton>
                            <HoldButton className='btn btn-outline-success' onFire={onGrowViewBoxHeight}>+</HoldButton>
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
                        <HoldButton className='btn-outline-secondary mb-1' onFire={gotoViewBoxUp}>🔼</HoldButton>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflow: 'auto'
                        }}>
                            <HoldButton className='btn-outline-secondary me-1' onFire={gotoViewBoxLeft}>◀️</HoldButton>

                            <div onWheel={handleOnWheel} style={{ overflow: 'auto', overscrollBehavior: 'contain' }}>
                                <PatternRowHeaderComponent setDropDownPos={setDropDownPos} pos={viewBox} />
                                {patternState.pattern
                                    .filter((_, rowIndex) => rowIndex >= viewBox.row && rowIndex <= viewBox.row + viewBox.wy)
                                    .map((row, rowIndex) => (
                                        <PatternRowComponent
                                            key={`row-${rowIndex + viewBox.row}`}
                                            row={row}
                                            rowIndex={rowIndex + viewBox.row}
                                            dropDownPosPatternCell={dropDownPosPatternCell}
                                            setDropDownPos={setDropDownPos}
                                            setDropDownPosPatternCell={setDropDownPosPatternCell}
                                            pos={viewBox}
                                        />
                                    ))}
                                <PatternRowHeaderComponent setDropDownPos={setDropDownPos} pos={viewBox} />
                            </div>
                            <HoldButton className='btn-outline-secondary ms-1' onFire={gotoViewBoxRight}>▶️</HoldButton>
                        </div>
                        <HoldButton className='btn-outline-secondary mt-1' onFire={gotoViewBoxDown}>🔽</HoldButton>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
