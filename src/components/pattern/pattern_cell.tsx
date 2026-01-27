import { FC, memo, MouseEvent, ReactNode, useMemo } from 'react'
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
    hasError?: boolean
    children?: ReactNode
    scaleFactor?: number
}

const PatterCellComponent: FC<propTypes> = ({
    row, 
    col,
    cell,
    color,
    onClick,
    onMouseOver,
    showCellCrochetType,
    hasError = false,
    scaleFactor = 1,
    children
}) => {
    const cellStyle = useMemo(() => ({
        border: hasError ? '1px solid red' : '',
        backgroundColor: hasError ? 'black' : color,
        width: `${scaleFactor}em`,
        height: `${scaleFactor}em`,
    }), [hasError, color, scaleFactor]);

    const stitchTypeStyle = useMemo(() => ({
        backgroundImage: showCellCrochetType && cell.t !== CELL_TYPE.EMPTY ? `url('./assets/${cell.t}${hasError ? '.error' : ''}.svg')` : '',
        backgroundColor: hasError ? 'black' : color,
    }), [showCellCrochetType, cell.t, hasError, color]);

    const title = useMemo(() => `${cell.t.toUpperCase()} (${col}:${row}) ${hasError ? ' ERROR' : ''}`, [cell.t, col, row, hasError])

    return (
        <div
            className="cell"
            onClick={onClick}
            onMouseOver={onMouseOver}
            title={title}
            style={cellStyle}
        >
            <div 
            className="stichtype"
            style={stitchTypeStyle}>
                {children} 
            </div>
        </div>
    )
}

export const MemoizedPatternCell = memo(PatterCellComponent);
