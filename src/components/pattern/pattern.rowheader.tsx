import { FC } from "react"
import { useStore } from "../../context"
import { TDropDownPos } from "../../model/patterntype.enum"


type PROPS = {
    setDropDownPos: (pos: TDropDownPos) => void
}

export const PatternRowHeaderComponent: FC<PROPS> = ({ setDropDownPos }) => {
    const patternState = useStore((state) => state.patternState)

    return (
        <div className="r">
            <div className="cell empty rownumber">&nbsp;</div>
            {patternState.pattern[0].map((col, colIndex) => (
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