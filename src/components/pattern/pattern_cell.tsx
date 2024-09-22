import { FC, MouseEvent, ReactNode } from 'react'
import { CELL_TYPE } from '../../model/patterntype.enum'
import './pattern_cell.css'
import { IPatternCell } from '../../model/patterncell.model'

type propTypes = {
    row: number,
    col: number,
    cell: IPatternCell
    color: string
    onClick: (e: MouseEvent<HTMLElement>) => void
    onMouseOver: (e: MouseEvent<HTMLElement>) => void
    showCellCrochetType?: boolean
    children?: ReactNode
}

export const PatterCellComponent: FC<propTypes> = ({
    row, 
    col,
    cell,
    color,
    onClick,
    onMouseOver,
    showCellCrochetType,
    children
}) => {
    return (
        <div
            className="cell"
            onClick={onClick}
            onMouseOver={onMouseOver}
            title={`${cell.type.toUpperCase()} (${col}:${row})`}
            style={{
                backgroundColor: color,
            }}
        >
            <div 
            className="stichtype"
            style={{
                backgroundImage: showCellCrochetType && cell.type !== CELL_TYPE.EMPTY ? `url('./assets/${cell.type}.svg')` : '',
            }}>
                {children} 
            </div>
        </div>
    )
}
