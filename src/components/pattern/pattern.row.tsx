import { FC, Fragment, MouseEvent, useCallback } from "react"
import { useStore } from "../../context"
import { IPatternRow } from "../../model/patterncell.model"
import { MemoizedPatternCell } from "./pattern_cell"
import { PatternDraw } from "../shared/patterndraw"
import { TDropDownPos } from "../../model/patterntype.enum"

type PROPS = {
    row: IPatternRow,
    rowIndex: number,
    dropDownPosPatternCell: TDropDownPos,
    setDropDownPos: (pos: TDropDownPos) => void
    setDropDownPosPatternCell: (pos: TDropDownPos) => void
}

export const PatternRowComponent: FC<PROPS> = ({ row, rowIndex, dropDownPosPatternCell, setDropDownPos, setDropDownPosPatternCell }) => {
    const {
        patternState,
        changeCell,
        showCellStitchType,
    } = useStore((state) => state)

    const handleClick = useCallback((row: number, col: number, mouseOver: boolean, event: MouseEvent<HTMLElement>) => {
        if (dropDownPosPatternCell.opened) {
            setDropDownPosPatternCell({ ...dropDownPosPatternCell, opened: false })
            return
        }
        if (event.ctrlKey) {
            setDropDownPosPatternCell({ row: row, col: col, x: event.clientX, y: event.clientY, opened: true })
            return
        }
        changeCell(row, col, mouseOver)
    }, [changeCell, dropDownPosPatternCell, setDropDownPosPatternCell])


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

    return (
        <div  className="r">
            <div
                className="cell rownumber"
                onClick={(e) => {
                    setDropDownPos({
                        row: rowIndex,
                        col: -1,
                        x: e.clientX,
                        y: e.clientY,
                        opened: true
                    })
                }}
                title={`${patternState.pattern.length - rowIndex}`}
            >
                {patternState.pattern.length - rowIndex}
            </div>
            {row.map((col, colIndex) => (
                <Fragment key={`col-${colIndex}`}>
                    <MemoizedPatternCell
                        onClick={(e) => {
                            if (e.stopPropagation)
                                e.stopPropagation()
                            if (e.preventDefault)
                                e.preventDefault()
                            handleClick(rowIndex, colIndex, false, e)
                        }}
                        color={PatternDraw.getCellColor(patternState.pattern, patternState.colors, rowIndex, colIndex)}
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
                    />
                    
                </Fragment>
            ))}

            <div
                key={`colend-${rowIndex}`}
                className="cell rownumber"
                onClick={(e) => {
                    setDropDownPos({
                        row: rowIndex,
                        col: -1,
                        x: e.clientX,
                        y: e.clientY,
                        opened: true
                    })
                }}
                title={`${patternState.pattern.length - rowIndex}`}
            >
                {patternState.pattern.length - rowIndex}
            </div>
        </div>
    )
}