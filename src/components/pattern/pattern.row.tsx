import { FC, Fragment, MouseEvent, useCallback, useMemo } from "react"
import { useStore } from "../../context"
import { IPatternRow } from "../../model/patterncell.model"
import { TDropDownPos } from "../../model/patterntype.enum"
import { PatternCellContainer } from "./pattern.cell.container"

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
    } = useStore((state) => state)

    const style: React.CSSProperties = useMemo(() => (
            {
                height: `${patternState.scaleFactor}em`,
                lineHeight: `${patternState.scaleFactor}em`,
                alignmentBaseline: 'middle',
                textAlign: 'center',
            }), [patternState.scaleFactor])

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
                style={style}
            >
                {patternState.pattern.length - rowIndex}
            </div>
            {row.map((col, colIndex) => (
                <Fragment key={`col-${colIndex}`}>
                    <PatternCellContainer
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        onClick={handleClick}
                        onMouseOver={handleMouseOver}
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
                style={style}
            >
                {patternState.pattern.length - rowIndex}
            </div>
        </div>
    )
}