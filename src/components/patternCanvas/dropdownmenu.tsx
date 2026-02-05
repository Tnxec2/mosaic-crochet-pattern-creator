import { FC, MouseEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useStore } from "../../context"
import { TDropDownPos } from "../../model/patterntype.enum"
import { DropDown, MenuItemDivider } from "../pattern/dropdown"
import { OutlineContentPasteGo } from "../../icons/paste"
import { TwotoneContentPasteGo } from "../../icons/paste.filled"
import { EyeInvisibleFilled } from "../../icons/eyeinvisible"
import { EyeFilled } from "../../icons/eye"

export const DropDownMenu: FC<{
        row: number,
        col: number,
        x: number,
        y: number,
        }> = ({
            row,
            col,
            x,
            y,
        }) => {
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
        showBufferData,
        toggleShowBufferData,
        paste,
        setStart,
        setEnd,
    } = useStore()

    

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

    useEffect(() => {   
        if (row >= 0 && col >= 0 && row < patternState.pattern.length && col < patternState.pattern[0].length)
            setDropDownPosPatternCell({ row, col, x, y, opened: true })
        else {
            console.log("open postion for row/col menu", row, col);
            
            setDropDownPos({ row, col, x, y, opened: true })
        }
    }, [row, col, x, y, patternState.pattern.length, patternState.pattern[0].length])

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
                // MenuItemDivider,
                // { name: 'change action'},
                // ...(Object.values(ACTION_TYPES)
                // .filter(action => action !== patternState.selectedAction)
                // .map((value) => {
                //     return { 
                //         name: value,
                //         action: value,
                //         color: patternState.colors[patternState.selectedColorIndex], 
                //         onClick: () => savePattern({...patternState, selectedAction: value})
                //     } 
                // } )),
                // MenuItemDivider,
                // { name: 'change color'},
                // ...(patternState.colors
                //     .filter((color, index) => index !== patternState.selectedColorIndex)
                //     .map((color) => {
                //         let colorIndex = patternState.colors.indexOf(color)
                //         return { 
                //             name: `Color ${colorIndex+1}`,
                //             action: ACTION_TYPES.COLOR,
                //             color: color,
                //             onClick: () => savePattern({...patternState, selectedColorIndex: colorIndex})
                //         } 
                //     } )
                // ),
            
                MenuItemDivider,
                {
                    name: 'start copy',
                    onClick: () => 
                        setStart(dropDownPosPatternCell),
                },
                {
                    name: 'end copy',
                    onClick: () => 
                        setEnd(dropDownPosPatternCell),
                },
                {
                    name: <><OutlineContentPasteGo/> paste</>,
                    onClick: () => 
                        paste(dropDownPosPatternCell),
                },
                {
                    name: <><TwotoneContentPasteGo/> paste with color</>,
                    onClick: () => 
                        paste(dropDownPosPatternCell, true),
                },
                {
                    name: showBufferData ? <><EyeInvisibleFilled/> hidde buffer preview</> : <><EyeFilled/> show buffer preview</>,
                    onClick: () => toggleShowBufferData(),
                }
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
        </>
    )
}