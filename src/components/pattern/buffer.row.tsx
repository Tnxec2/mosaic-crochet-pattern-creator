import { FC, Fragment } from "react"
import { useStore } from "../../context"
import { IPatternRow } from "../../model/patterncell.model"
import { PatternDraw } from "../shared/patterndraw"
import { BufferCellComponent } from "./buffer.cell"

type PROPS = {
    row: IPatternRow,
    rowIndex: number,
}

export const BufferRowComponent: FC<PROPS> = ({ row, rowIndex }) => {
    const {
        patternState,
        bufferdata,
    } = useStore((state) => state)


    return (
        <div  className="r">
            {row.map((col, colIndex) => (
                <Fragment key={`col-${colIndex}`}>
                    <BufferCellComponent
                        //color="#fff"
                        color={PatternDraw.getCellColor(bufferdata, patternState.colors, rowIndex, colIndex)}
                        row={rowIndex}
                        col={row.length - colIndex}
                        cell={col}
                    />
                </Fragment>
            ))}
        </div>
    )
}