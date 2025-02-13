import { FC, MouseEvent, useCallback, useMemo, useState } from 'react'

import { Card } from 'react-bootstrap'
import './pattern.css'
import { ACTION_TYPES } from '../../model/actiontype.enum'
import { DropDown, MenuItemDivider } from './dropdown'
import { PatternHeaderComponent } from './pattern.header'
import { PatternRowHeaderComponent } from './pattern.rowheader'
import { PatternRowComponent } from './pattern.row'
import { useStore } from '../../context'
import { TDropDownPos } from '../../model/patterntype.enum'



export const PatternComponent: FC = () => {
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
    } = useStore((state) => state)


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
            onclose={() => setDropDownPosPatternCell({row: -1, col: -1, x: -1, y: -1, opened: false })}
            menu={[
                { name: `Cell ${patternState.pattern[0].length - dropDownPosPatternCell.col}:${patternState.pattern.length - dropDownPosPatternCell.row}`},
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
        />, [dropDownPosPatternCell.col, dropDownPosPatternCell.row, dropDownPosPatternCell.x, dropDownPosPatternCell.y, fillLeft, fillRight, patternState, savePattern])

    const dropDownRow = useMemo(() => 
        <DropDown
            x={dropDownPos.x}
            y={dropDownPos.y}
            onclose={(e) => closeDropDown(e)}
            menu={[
                { name: `Row ${patternState.pattern.length - dropDownPos.row}`},
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
        />, [ dropDownPos.x, dropDownPos.y, dropDownPos.row, patternState.pattern.length, patternState.selectedAction, patternState.colors, patternState.selectedColorIndex, closeDropDown, addRow, deleteRow, fillRow])

    const dropDownColumn = useMemo(() => 
        <DropDown
            x={dropDownPos.x}
            y={dropDownPos.y}
            onclose={(e) => closeDropDown(e)}
            menu={[
                { name: `Column ${patternState.pattern[0].length - dropDownPos.col}`},
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
                    <div
                        className="noselect"
                        id="pattern"
                        style={{
                            transform: `scale(${patternState.scaleFactor})`
                        }}
                    >
                        <PatternRowHeaderComponent setDropDownPos={setDropDownPos} />
                        
                        {patternState.pattern.map((row, rowIndex) => (
                            <PatternRowComponent key={`row-${rowIndex}`}
                                row={row}
                                rowIndex={rowIndex}
                                dropDownPosPatternCell={dropDownPosPatternCell}
                                setDropDownPos={setDropDownPos}
                                setDropDownPosPatternCell={setDropDownPosPatternCell}
                            />
                        ))}
                        <PatternRowHeaderComponent setDropDownPos={setDropDownPos} />
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
