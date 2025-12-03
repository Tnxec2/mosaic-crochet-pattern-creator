import { FC, MouseEvent, useCallback, useMemo, useState } from 'react'

import { Card } from 'react-bootstrap'
import '../pattern.css'
import { DropDown, MenuItemDivider } from '../dropdown'
import { PatternHeaderComponent } from '../pattern.header'
import { PatternRowHeaderWindowedComponent } from './pattern.rowheader'
import { PatternRowWindowedComponent } from './pattern.row'
import { HoldButton } from './holdbutton'
import { useStore } from '../../../context'
import { TDropDownPos } from '../../../model/patterntype.enum'
import { ViewBoxSizeComponent } from './viewbox.size'
import { BufferRowComponent } from '../buffer.row'
import { OutlineContentPasteGo } from '../../../icons/paste'
import { EyeInvisibleFilled } from '../../../icons/eyeinvisible'
import { EyeFilled } from '../../../icons/eye'
import { TwotoneContentPasteGo } from '../../../icons/paste.filled'


const SCROLL_STEP = 5;

export const PatternWindowedComponent: FC = () => {
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
        viewBox,
        viewBox2,
        splittedViewBox,
        gotoViewBoxUp,
        gotoViewBoxDown,
        gotoViewBoxLeft,
        gotoViewBoxRight,
        showBufferData,
        toggleShowBufferData,
        bufferdata,
        paste,
        setStart,
        setEnd,
    } = useStore()

    const handleOnWheel = useCallback((ev: globalThis.WheelEvent, viewBoxNumber: number) => {
        ev.preventDefault();

        const { deltaY, shiftKey } = ev

        if (shiftKey) {
            if (deltaY > 0) {
                gotoViewBoxRight(SCROLL_STEP, viewBoxNumber)
            } else {
                gotoViewBoxLeft(SCROLL_STEP, viewBoxNumber)
            }
        } else {
            if (deltaY > 0) {
                gotoViewBoxDown(SCROLL_STEP, viewBoxNumber)
            } else {
                gotoViewBoxUp(SCROLL_STEP, viewBoxNumber)
            }
        }
    }, [gotoViewBoxDown, gotoViewBoxLeft, gotoViewBoxRight, gotoViewBoxUp])

    const viewBoxRefCallback = useCallback(
        (node: HTMLDivElement) => {
            if (node == null) {
                return;
            }
            node.addEventListener('wheel', (e) => handleOnWheel(e, 1), { passive: false });
        },
        [handleOnWheel],
    );

    const viewBox2RefCallback = useCallback(
        (node: HTMLDivElement) => {
            if (node == null) {
                return;
            }
            node.addEventListener('wheel', (e) => handleOnWheel(e, 2), { passive: false });
        },
        [handleOnWheel],
    );

    const [dropDownPos, setDropDownPos] = useState<TDropDownPos>({
        viewBoxNumber: 1,
        row: 0,
        col: 0,
        x: 0,
        y: 0,
        opened: false
    })

    const [dropDownPosPatternCell, setDropDownPosPatternCell] = useState<TDropDownPos>({
        viewBoxNumber: 1,
        row: 0,
        col: 0,
        x: 0,
        y: 0,
        opened: false
    })

    const closeDropDown = useCallback((viewBoxNumber?: number, e?: MouseEvent<HTMLLIElement>) => {
        setDropDownPos({ viewBoxNumber: viewBoxNumber, row: -1, col: -1, x: e?.screenX || 0, y: e?.screenY || 0, opened: false })
        e?.stopPropagation()
    }, [])

    const dropDownCell = useMemo(() =>
        <DropDown
            x={dropDownPosPatternCell.x}
            y={dropDownPosPatternCell.y}
            onclose={() => setDropDownPosPatternCell({ viewBoxNumber: dropDownPosPatternCell.viewBoxNumber, row: -1, col: -1, x: -1, y: -1, opened: false })}
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
                    name: <><OutlineContentPasteGo /> paste</>,
                    onClick: () =>
                        paste(dropDownPosPatternCell),
                },
                {
                    name: <><TwotoneContentPasteGo /> paste with color</>,
                    onClick: () =>
                        paste(dropDownPosPatternCell, true),
                },
                {
                    name: showBufferData ? <><EyeInvisibleFilled /> hidde buffer preview</> : <><EyeFilled /> show buffer preview</>,
                    onClick: () => toggleShowBufferData(),
                }

            ]}
        />, [dropDownPosPatternCell, paste, showBufferData, setStart, setEnd, toggleShowBufferData, fillLeft, fillRight, patternState])

    const dropDownRow = useMemo(() =>
        <DropDown
            x={dropDownPos.x}
            y={dropDownPos.y}
            onclose={(e) => closeDropDown(dropDownPos.viewBoxNumber, e)}
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
        />, [dropDownPos.x, dropDownPos.y, dropDownPos.row, dropDownPos.viewBoxNumber, patternState.pattern.length, patternState.selectedAction, patternState.colors, patternState.selectedColorIndex, closeDropDown, addRow, deleteRow, fillRow])

    const dropDownColumn = useMemo(() =>
        <DropDown
            x={dropDownPos.x}
            y={dropDownPos.y}
            onclose={(e) => closeDropDown(dropDownPos.viewBoxNumber, e)}
            menu={[
                { name: `Column ${patternState.pattern[0].length - dropDownPos.col - viewBox.col}` },
                MenuItemDivider,
                {
                    name: '➕ add col',
                    onClick: () =>
                        addColumn(dropDownPos.col + viewBox.col)
                },
                {
                    name: '❌ delete col',
                    onClick: () =>
                        deleteColumn(dropDownPos.col + viewBox.col)
                },
                MenuItemDivider,
                {
                    name: 'col fill',
                    onClick: () =>
                        fillColumn(dropDownPos.col + viewBox.col),
                    action: patternState.selectedAction,
                    color: patternState
                        .colors[
                        patternState
                            .selectedColorIndex
                    ]
                }
            ]}
        />, [dropDownPos.x, dropDownPos.y, dropDownPos.col, dropDownPos.viewBoxNumber, viewBox.col, patternState.pattern, patternState.selectedAction, patternState.colors, patternState.selectedColorIndex, closeDropDown, addColumn, deleteColumn, fillColumn])




    return (
        <>
            {dropDownPos?.opened && dropDownPos.row === -1 && dropDownColumn}
            {dropDownPos?.opened && dropDownPos.col === -1 && dropDownRow}
            {dropDownPosPatternCell?.opened && dropDownCell}

            <Card className="h-100">
                <PatternHeaderComponent />
                <Card.Body className="pattern-container">

                    <ViewBoxSizeComponent />
                    <div className='mt-3 d-flex flex-row' 
                            style={{
                                transformOrigin: 'left top',
                                transform: `scale(${patternState.scaleFactor})`,
                            }}>
                        <div
                            className="noselect d-flex flex-column"
                            id="pattern"
                        >
                            <HoldButton className='btn-outline-secondary btn-sm mb-1' onFire={() => gotoViewBoxUp(1)}>🔼</HoldButton>
                            <div className='d-flex flex-row'>
                                <HoldButton className='btn-outline-secondary btn-sm me-1' onFire={() => gotoViewBoxLeft(1)}>◀️</HoldButton>

                                <div ref={viewBoxRefCallback}>
                                    <PatternRowHeaderWindowedComponent setDropDownPos={(pos) => setDropDownPos({...pos, viewBoxNumber: 1})} pos={viewBox} />
                                    {patternState.pattern
                                        .filter((_, rowIndex) => rowIndex >= viewBox.row && rowIndex < viewBox.row + viewBox.wy)
                                        .map((row, rowIndex) => (
                                            <PatternRowWindowedComponent
                                                key={`row-${rowIndex + viewBox.row}`}
                                                row={row}
                                                rowIndex={rowIndex + viewBox.row}
                                                dropDownPosPatternCell={dropDownPosPatternCell}
                                                setDropDownPos={(pos) => setDropDownPos({...pos, viewBoxNumber: 1})}
                                                setDropDownPosPatternCell={(pos) => setDropDownPosPatternCell({...pos, viewBoxNumber: 1})}
                                                pos={viewBox}
                                            />
                                        ))}
                                    <PatternRowHeaderWindowedComponent setDropDownPos={(pos) => setDropDownPos({...pos, viewBoxNumber: 1})} pos={viewBox} />
                                </div>
                                <HoldButton className='btn-outline-secondary btn-sm ms-1' onFire={() => gotoViewBoxRight(1)}>▶️</HoldButton>
                            </div>
                            <HoldButton className='btn-outline-secondary btn-sm mt-1' onFire={() => gotoViewBoxDown(1)}>🔽</HoldButton>
                        </div>
                        {splittedViewBox && 

                        <div
                            className="noselect d-flex flex-column ms-3"
                            id="pattern"
                        >
                            <HoldButton className='btn-outline-secondary btn-sm mb-1' onFire={() => gotoViewBoxUp(1, 2)}>🔼</HoldButton>
                            <div className='d-flex flex-row'>
                                <HoldButton className='btn-outline-secondary btn-sm me-1' onFire={() => gotoViewBoxLeft(1, 2)}>◀️</HoldButton>

                                <div ref={viewBox2RefCallback}>
                                    <PatternRowHeaderWindowedComponent setDropDownPos={(pos) => setDropDownPos({...pos, viewBoxNumber: 2})} pos={viewBox2} />
                                    {patternState.pattern
                                        .filter((_, rowIndex) => rowIndex >= viewBox2.row && rowIndex < viewBox2.row + viewBox2.wy)
                                        .map((row, rowIndex) => (
                                            <PatternRowWindowedComponent
                                                key={`row-${rowIndex + viewBox2.row}`}
                                                row={row}
                                                rowIndex={rowIndex + viewBox2.row}
                                                dropDownPosPatternCell={dropDownPosPatternCell}
                                                setDropDownPos={(pos) => setDropDownPos({...pos, viewBoxNumber: 2})}
                                                setDropDownPosPatternCell={(pos) => setDropDownPosPatternCell({...pos, viewBoxNumber: 1})}
                                                pos={viewBox2}
                                            />
                                        ))}
                                    <PatternRowHeaderWindowedComponent setDropDownPos={(pos) => setDropDownPos({...pos, viewBoxNumber: 2})} pos={viewBox2} />
                                </div>
                                <HoldButton className='btn-outline-secondary btn-sm ms-1' onFire={() => gotoViewBoxRight(1, 2)}>▶️</HoldButton>
                            </div>
                            <HoldButton className='btn-outline-secondary btn-sm mt-1' onFire={() => gotoViewBoxDown(1, 2)}>🔽</HoldButton>
                        </div>
                        }
                    </div>


                    {showBufferData && 
                    <div
                        className="noselect mt-3"
                        id="copyBuffer"
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <h6>Copy Buffer</h6>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflow: 'auto'
                        }}>
                            <div>
                                {bufferdata
                                    .map((row, rowIndex) => (
                                        <BufferRowComponent
                                            key={`bufferRow-${rowIndex}`}
                                            row={row}
                                            rowIndex={rowIndex}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>}
                </Card.Body>
            </Card>
        </>
    )
}
