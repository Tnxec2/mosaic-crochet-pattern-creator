import { FC, MouseEvent, ReactNode } from 'react'
import { CELL_TYPE } from '../../model/patterntype.enum'
import './pattern_cell.css'
import { IPatternCell } from '../../model/patterncell.model'

type propTypes = {
    row: number,
    col: number,
    cell: IPatternCell
    color: string
    children?: ReactNode
}

export const BufferCellComponent: FC<propTypes> = ({
    row, 
    col,
    cell,
    color,
    children
}) => {
    return (
        <div
            className="cell"
            title={`${cell.type.toUpperCase()} (${col}:${row})`}
            style={{
                backgroundColor: color,
            }}
        >
            <div 
            className="stichtype"
            style={{
                backgroundImage: cell.type !== CELL_TYPE.EMPTY ? `url('./assets/${cell.type}.svg')` : '',
            }}>
                {children} 
            </div>
        </div>
    )
}
