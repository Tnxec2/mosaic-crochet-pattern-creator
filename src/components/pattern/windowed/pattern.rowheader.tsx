import { FC, useContext } from "react"
import { PatternContext } from "../../../context"
import { TVIEWBOX_SIZE, TDropDownPos } from "./pattern"

type PROPS = {
    setDropDownPos: (pos: TDropDownPos) => void
    pos?: TVIEWBOX_SIZE
}

export const PatternRowHeaderComponent: FC<PROPS> = ({ setDropDownPos, pos }) => {
    const {
        patternState
    } = useContext(PatternContext)

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
                    title={`${patternState.pattern[0].length - colIndex}`}
                >
                    {patternState.pattern[0].length - colIndex}
                </div>
            ))}
            <div className="cell empty rownumber">&nbsp;</div>
        </div>
    )
}