import { FC, MouseEvent, useCallback, useMemo } from "react";
import { useStore } from "../../context";
import { hasX } from "../../model/patterntype.enum";
import { PatternDraw } from "../shared/patterndraw";
import { MemoizedPatternCell } from "./pattern_cell";

type PROPS = {
    rowIndex: number;
    colIndex: number;
    onClick: (row: number, col: number, mouseOver: boolean, event: MouseEvent<HTMLElement>) => void;
    onMouseOver: (e: MouseEvent<HTMLElement>, row: number, col: number) => void;
}

export const PatternCellContainer: FC<PROPS> = ({ rowIndex, colIndex, onClick, onMouseOver }) => {
    const { patternState, showCellStitchType } = useStore((state) => state);
    const cell = patternState.pattern[rowIndex][colIndex];

    const hasError = useMemo(() => {
        const isX = hasX(cell.t);
        if (!isX) return false;

        const upperRow = patternState.pattern[rowIndex - 1];
        const lowerRow = patternState.pattern[rowIndex + 1];

        const hasErrorUp = upperRow && hasX(upperRow[colIndex].t);
        const hasErrorDown = lowerRow && hasX(lowerRow[colIndex].t);

        return hasErrorUp || hasErrorDown;
    }, [cell.t, colIndex, rowIndex, patternState.pattern]);

    const color = useMemo(() => PatternDraw.getCellColor(patternState.pattern, patternState.colors, rowIndex, colIndex), [patternState.pattern, patternState.colors, rowIndex, colIndex]);

    const handleOnClick = useCallback((e: MouseEvent<HTMLElement>) => {
        onClick(rowIndex, colIndex, false, e)
    }, [onClick, rowIndex, colIndex]);

    const handleOnMouseOver = useCallback((e: MouseEvent<HTMLElement>) => {
        onMouseOver(e, rowIndex, colIndex)
    }, [onMouseOver, rowIndex, colIndex]);

    return <MemoizedPatternCell
        onClick={handleOnClick}
        onMouseOver={handleOnMouseOver}
        color={color}
        row={patternState.pattern.length - rowIndex}
        col={patternState.pattern[0].length - colIndex}
        cell={cell}
        showCellCrochetType={showCellStitchType}
        hasError={hasError}
    />
}
