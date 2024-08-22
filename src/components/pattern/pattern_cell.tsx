import { FC, MouseEvent } from 'react'
import { CELL_TYPE } from '../../model/patterntype.enum'
import './pattern_cell.css'
import { IPatternCell } from '../../model/patterncell.model'

type propTypes = {
    cell: IPatternCell
    color: string
    onClick: (e: MouseEvent<HTMLElement>) => void
    onMouseOver: (e: MouseEvent<HTMLElement>) => void
    showCellCrochetType?: boolean
}

export const PatterCellComponent: FC<propTypes> = ({
    cell,
    color,
    onClick,
    onMouseOver,
    showCellCrochetType
}) => {
    const renderSwitch = () => {
        if (!showCellCrochetType || cell.type === CELL_TYPE.EMPTY) return <></>
        else
            return (
                <img
                    src={`./assets/${cell.type}.svg`}
                    title={cell.type.toUpperCase()}
                    alt={cell.type}
                ></img>
            )
    }

    return (
        <div
            className="cell"
            onClick={onClick}
            onMouseOver={onMouseOver}
            style={{
                backgroundColor: color
            }}
        >
            {renderSwitch()}
        </div>
    )
}
