import { FC, Fragment, MouseEvent, useCallback, useContext } from "react"
import { PatternContext } from "../../../context"
import { TVIEWBOX_SIZE, TDropDownPos } from "./pattern"
import { IPatternRow } from "../../../model/patterncell.model"
import { PatterCellComponent } from "../pattern_cell"
import { PatternDraw } from "../../shared/patterndraw"

type PROPS = {
    row: IPatternRow,
    rowIndex: number,
    dropDownPosPatternCell: TDropDownPos,
    setDropDownPos: (pos: TDropDownPos) => void,
    setDropDownPosPatternCell: (pos: TDropDownPos) => void,
    pos?: TVIEWBOX_SIZE,
}

export const PatternRowComponent: FC<PROPS> = ({ pos, row, rowIndex, dropDownPosPatternCell, setDropDownPos, setDropDownPosPatternCell }) => {
    const {
        patternState,
        changeCell,
        showCellStitchType,
    } = useContext(PatternContext)

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
            {row
            .filter((_, colIndex) => !pos || (colIndex >= pos.col && colIndex <= pos.col + pos.wx))
            .map((col, colIndex) => (
                <Fragment key={`col-${colIndex+(pos?.col||0)}`}>
                    <PatterCellComponent
                        onClick={(e) => {
                            if (e.stopPropagation)
                                e.stopPropagation()
                            if (e.preventDefault)
                                e.preventDefault()
                            handleClick(rowIndex, colIndex+(pos?.col||0), false, e)
                        }}
                        color={PatternDraw.getCellColor(patternState.pattern, patternState.colors, rowIndex, colIndex+(pos?.col||0))}
                        onMouseOver={(e) =>
                            handleMouseOver(
                                e,
                                rowIndex, 
                                colIndex+(pos?.col||0)
                            )
                        }
                        row={patternState.pattern.length - rowIndex}
                        col={row.length - colIndex - (pos?.col||0)}
                        cell={col}
                        showCellCrochetType={showCellStitchType}
                    >
                    </PatterCellComponent>
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