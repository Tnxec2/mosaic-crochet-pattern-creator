import { FC, MouseEvent } from 'react'


type PROPS = {
    color: string
    onClick: (e: MouseEvent<HTMLElement>) => void
}

export const MinimapCellComponent: FC<PROPS> = ({
    color,
    onClick,
}) => {
    return (
        <div
            className="minimap-cell"
            onClick={onClick}
            style={{
                backgroundColor: color,
            }}
        >
        </div>
    )
}
