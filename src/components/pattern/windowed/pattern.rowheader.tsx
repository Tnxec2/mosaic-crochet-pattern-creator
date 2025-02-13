import { FC, } from "react"
import { useStore } from "../../../context"
import { TDropDownPos, TVIEWBOX_SIZE } from "../../../model/patterntype.enum"


type PROPS = {
    setDropDownPos: (pos: TDropDownPos) => void
    pos: TVIEWBOX_SIZE
}

export const PatternRowHeaderComponent: FC<PROPS> = ({ setDropDownPos, pos }) => {
    const patternState = useStore((state) => state.patternState)

    return (
        <div className="r">
            <div className="cell empty rownumber">&nbsp;</div>
            {patternState.pattern[0]
            .filter((_, colIndex) => !pos || (colIndex >= pos.col && colIndex <= pos.col + pos.wx))
            .map((col, colIndex) => (
                <div
                    key={`rowend-${colIndex}`}
                    className="cell colnumber"
                    onClick={(e) => {
                        setDropDownPos({
                            row: -1,
                            col: colIndex,
                            x: e.clientX,
                            y: e.clientY,
                            opened: true
                        })
                    }}
                    title={`${patternState.pattern[0].length - colIndex - pos.col }`}
                >
                    {patternState.pattern[0].length - colIndex - pos.col }
                </div>
            ))}
            <div className="cell empty rownumber">&nbsp;</div>
        </div>
    )
}