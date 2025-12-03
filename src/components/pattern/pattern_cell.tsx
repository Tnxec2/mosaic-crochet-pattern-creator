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
    children
}) => {
    const cellStyle = useMemo(() => ({
        border: hasError ? '1px solid red' : '',
        backgroundColor: hasError ? 'black' : color,
    }), [hasError, color]);

    const stitchTypeStyle = useMemo(() => ({
        backgroundImage: showCellCrochetType && cell.t !== CELL_TYPE.EMPTY ? `url('./assets/${cell.t}${hasError ? '.error' : ''}.svg')` : '',
        backgroundColor: hasError ? 'black' : color,
    }), [showCellCrochetType, cell.t, hasError, color]);

    return (
        <div
            className="cell"
            onClick={onClick}
            onMouseOver={onMouseOver}
            title={`${cell.t.toUpperCase()} (${col}:${row}) ${hasError ? ' ERROR' : ''}`}
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
