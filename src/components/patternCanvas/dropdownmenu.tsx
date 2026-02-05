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
            
            setDropDownPos({ row, col, x, y, opened: !(row < 0 && col < 0) })
        }
    }, [row, col, x, y, patternState.pattern.length, patternState.pattern[0].length])

    const closeAllDropDowns = useCallback((e?: MouseEvent<HTMLLIElement>) => {
        e?.stopPropagation()
        e?.preventDefault()

        // Verzögern Sie das Schließen des Dropdowns mit setTimeout, um zu verhindern,
        // dass das Klick-Event an das darunter liegende Canvas-Element weitergegeben wird,
        // nachdem das Dropdown aus dem DOM entfernt wurde.
        setTimeout(() => {
            setDropDownPos(prev => ({ ...prev, opened: false }))
            setDropDownPosPatternCell(prev => ({ ...prev, opened: false }))
        }, 0)
    }, [])

    const dropDownCell = useMemo(() => 
        <DropDown
            x={dropDownPosPatternCell.x}
            y={dropDownPosPatternCell.y}
            onclose={closeAllDropDowns}
            menu={[
                { name: `Cell ${patternState.pattern[0].length - dropDownPosPatternCell.col}:${patternState.pattern.length - dropDownPosPatternCell.row}`},
                MenuItemDivider,
                {
                    name: '➡️ fill right',
                    onClick: (e) => {
                        fillRight(dropDownPosPatternCell.row, dropDownPosPatternCell.col)
                        closeAllDropDowns(e)
                    },
                    action: patternState.selectedAction,
                    color: patternState.colors[patternState.selectedColorIndex], 
                },
                {
                    name: '⬅️ fill left',
                    onClick: (e) => {
                        fillLeft(dropDownPosPatternCell.row, dropDownPosPatternCell.col)
                        closeAllDropDowns(e)
                    },
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
                    onClick: (e) => {
                        setStart(dropDownPosPatternCell)
                        closeAllDropDowns(e)
                    },
                },
                {
                    name: 'end copy',
                    onClick: (e) => {
                        setEnd(dropDownPosPatternCell)
                        closeAllDropDowns(e)
                    },
                },
                {
                    name: <><OutlineContentPasteGo/> paste</>,
                    onClick: (e) => {
                        paste(dropDownPosPatternCell)
                        closeAllDropDowns(e)
                    },
                },
                {
                    name: <><TwotoneContentPasteGo/> paste with color</>,
                    onClick: (e) => {
                        paste(dropDownPosPatternCell, true)
                        closeAllDropDowns(e)
                    },
                },
                {
                    name: showBufferData ? <><EyeInvisibleFilled/> hidde buffer preview</> : <><EyeFilled/> show buffer preview</>,
                    onClick: (e) => {
                        toggleShowBufferData()
                        closeAllDropDowns(e)
                    },
                }
            ]}
        />, [closeAllDropDowns, dropDownPosPatternCell, fillLeft, fillRight, paste, patternState, setEnd, setStart, showBufferData, toggleShowBufferData])

    const dropDownRow = useMemo(() => 
        <DropDown
            x={dropDownPos.x}
            y={dropDownPos.y}
            onclose={closeAllDropDowns}
            menu={[
                { name: `Row ${patternState.pattern.length - dropDownPos.row}`},
                MenuItemDivider,
                {
                    name: '➕ add row',
                    onClick: (e) => {
                        addRow(dropDownPos.row)
                        closeAllDropDowns(e)
                    }
                },
                {
                    name: '❌ delete row',
                    onClick: (e) => {
                        deleteRow(dropDownPos.row)
                        closeAllDropDowns(e)
                    }
                },
                MenuItemDivider,
                {
                    name: 'row fill',
                    onClick: (e) => {
                        fillRow(dropDownPos.row)
                        closeAllDropDowns(e)
                    },
                    action: patternState.selectedAction,
                    color: patternState
                        .colors[
                        patternState
                            .selectedColorIndex
                    ]
                }
            ]}
        />, [addRow, closeAllDropDowns, deleteRow, dropDownPos.row, dropDownPos.x, dropDownPos.y, fillRow, patternState.colors, patternState.pattern.length, patternState.selectedAction, patternState.selectedColorIndex])

    const dropDownColumn = useMemo(() => 
        <DropDown
            x={dropDownPos.x}
            y={dropDownPos.y}
            onclose={closeAllDropDowns}
            menu={[
                { name: `Column ${patternState.pattern[0].length - dropDownPos.col}`},
                MenuItemDivider,
                {
                    name: '➕ add col',
                    onClick: (e) => {
                        addColumn(dropDownPos.col)
                        closeAllDropDowns(e)
                    }
                },
                {
                    name: '❌ delete col',
                    onClick: (e) => {
                        deleteColumn(dropDownPos.col)
                        closeAllDropDowns(e)
                    }
                },
                MenuItemDivider,
                {
                    name: 'col fill',
                    onClick: (e) => {
                        fillColumn(dropDownPos.col)
                        closeAllDropDowns(e)
                    },
                    action: patternState.selectedAction,
                    color: patternState
                        .colors[
                        patternState
                            .selectedColorIndex
                    ]
                }
            ]}
        />, [addColumn, closeAllDropDowns, deleteColumn, dropDownPos.col, dropDownPos.x, dropDownPos.y, fillColumn, patternState.colors, patternState.pattern, patternState.selectedAction, patternState.selectedColorIndex])


    return (
        <>
            {dropDownPos?.opened && dropDownPos.row === -1 && dropDownColumn}
            {dropDownPos?.opened && dropDownPos.col === -1 && dropDownRow}
            {dropDownPosPatternCell?.opened && dropDownCell}
        </>
    )
}