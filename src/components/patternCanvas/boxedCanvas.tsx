import { FC, useCallback, useState } from "react"

import Canvas from "./canvas"
import { useStore } from '../../context'
import { PatternDraw2, TSize } from "../shared/patterndraw2"
import { IPatternGrid } from "../../model/patterncell.model"
import { DEFAULT_CELL_SIZE, SCROLL_STEP } from "../../model/constats"
import { TVIEWBOX_SIZE } from "../../model/patterntype.enum"
import { HoldButton } from "../pattern/windowed/holdbutton"

type TDrawnState = {
    pattern: IPatternGrid;
    colors: string[],
    showCellStitchType: boolean,
    fontSize: number,
    viewBox: TVIEWBOX_SIZE
}

const getCoords = (
    e: React.MouseEvent<HTMLCanvasElement>,
    boxSize: TSize,
    viewBox: TVIEWBOX_SIZE
) => {
    const { clientX, clientY } = e;
    var rect = e.currentTarget.getBoundingClientRect();

    // get cell from pattern based on click position
    const col = Math.floor(((clientX - rect.left) - boxSize.rowNumberWidth) / boxSize.cellSize) + viewBox.col;
    const row = Math.floor(((clientY - rect.top) - boxSize.headerHeight) / boxSize.cellSize) + viewBox.row;

    // console.log('getCoords', { row, col, w: viewBox.row + viewBox.wy, h: viewBox.col + viewBox.wx });
    
    return { row, col };
}

type TPatternWindowedWithCanvasComponentProps = {
    viewBox: TVIEWBOX_SIZE,
    gotoViewBoxUp: (step: number) => void,
    gotoViewBoxDown: (step: number) => void,
    gotoViewBoxLeft: (step: number) => void,
    gotoViewBoxRight: (step: number) => void,
    onClicked: (clicked: { row: number; col: number, x: number, y: number }) => void,
}

export const BoxedCanvasComponent: FC<TPatternWindowedWithCanvasComponentProps> = ({
    viewBox, gotoViewBoxUp, gotoViewBoxDown, gotoViewBoxLeft, gotoViewBoxRight, onClicked
}) => {
    const {
        patternState,
        showCellStitchType,
        changeCell,

    } = useStore()

    const handleOnWheel = useCallback((ev: React.WheelEvent<HTMLDivElement>) => {
        ev.stopPropagation();

        const { deltaY, shiftKey } = ev
        
        if (shiftKey) {
            if (deltaY > 0) {
                if ( viewBox.col < patternState.pattern[0].length - viewBox.wx)
                    gotoViewBoxRight(SCROLL_STEP)
            } else {
                if ( viewBox.col > 0)
                    gotoViewBoxLeft(SCROLL_STEP)
            }
        } else {
            if (deltaY > 0) {
                if (viewBox.row < patternState.pattern.length - viewBox.wy)
                    gotoViewBoxDown(SCROLL_STEP)
            } else {
                if (viewBox.row > 0)
                    gotoViewBoxUp(SCROLL_STEP)
            }
        }
    }, [patternState.pattern, viewBox.wx, viewBox.wy, viewBox.row, viewBox.col])



    const [boxSize, setBoxSize] = useState<TSize>({
        width: 0,
        height: 0,
        rowNumberWidth: 0,
        headerHeight: 0,
        cellSize: patternState.scaleFactor * DEFAULT_CELL_SIZE
    });

    const [drawnState, setDrawnState] = useState<TDrawnState>({
        pattern: [],
        colors: [],
        showCellStitchType: false,
        fontSize: patternState.scaleFactor * DEFAULT_CELL_SIZE,
        viewBox: viewBox,
    });

    const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        if (canvas) {
            const fontSize = patternState.scaleFactor * DEFAULT_CELL_SIZE
            const size = PatternDraw2.drawPattern(
                patternState.pattern, patternState.colors, fontSize, showCellStitchType, canvas, ctx,
                drawnState.pattern, drawnState.colors, drawnState.showCellStitchType, drawnState.fontSize,
                viewBox,
                drawnState.viewBox
            )
            setBoxSize(size)

            setDrawnState((old) => ({
                ...old,
                pattern: patternState.pattern,
                colors: patternState.colors,
                showCellStitchType,
                fontSize: fontSize,
                viewBox: viewBox,
            }))
        } else {
            console.error("couldn't find canvas with id canvasPreview");
        }
    }, [patternState.pattern, patternState.colors, patternState.scaleFactor, showCellStitchType, 
        viewBox.row, viewBox.col, viewBox.wx, viewBox.wy]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>, mouseOver: boolean) => {

        //console.log("handleClick");
        
        const { clientX, clientY } = e;
        const { row, col } = getCoords(e, boxSize, viewBox);

        if (row >= viewBox.row && row < (viewBox.row + viewBox.wy) 
            && col >= viewBox.col && col < (viewBox.col + viewBox.wx)
        ) {
            if (e.ctrlKey)
                onClicked({ row, col, x: clientX, y: clientY })
            else
                changeCell(row, col, mouseOver)
        } else {
            const r = row < viewBox.row || row > viewBox.row + viewBox.wy - 1 ? -1 : row
            const c = col < viewBox.col || col > viewBox.col + viewBox.wx - 1 ? -1 : col

            onClicked({ row: r, col: c, x: clientX, y: clientY })
        }
    }, [boxSize, patternState.pattern, changeCell, viewBox.row, viewBox.col, viewBox.wx, viewBox.wy]);


    const [mouseOverCell, setMouseOverCell] = useState<{ row: number; col: number }>({ row: -1, col: -1 });

    const handleMouseOver = useCallback((
        e: React.MouseEvent<HTMLCanvasElement>
    ) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.buttons === 1) {
            const { row, col } = getCoords(e, boxSize, viewBox);

            if (row !== mouseOverCell.row || col !== mouseOverCell.col) {
                setMouseOverCell({ row, col });
                handleClick(e, true)
            } else {
                return;
            }
        }
    }, [handleClick, boxSize, mouseOverCell, viewBox]);

    return (
        <div
            className="noselect d-flex flex-column"
        >
            <HoldButton
                className='btn-outline-secondary btn-sm mb-1'
                disabled={viewBox.row <= 0}
                onFire={() => {
                if (viewBox.row > 0)
                    gotoViewBoxUp(1)
                }}>🔼</HoldButton>
            <div className='d-flex flex-row'>
                <HoldButton 
                    className='btn-outline-secondary btn-sm me-1'
                    disabled={viewBox.col <= 0}
                    onFire={() => {
                    if (viewBox.col > 0)
                        gotoViewBoxLeft(1)
                    }}
                    >◀️</HoldButton>
                <div onWheel={handleOnWheel} >
                    <Canvas
                        draw={draw}
                        className="canvas-preview"
                        onClick={(e: React.MouseEvent<HTMLCanvasElement>) => { handleClick(e, false) }}
                        onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => { handleMouseOver(e) }}
                    />
                </div>

                <HoldButton 
                    className='btn-outline-secondary btn-sm ms-1' 
                    disabled={viewBox.col >= patternState.pattern[0].length - viewBox.wx}
                    onFire={() => {
                    if (viewBox.col < patternState.pattern[0].length - viewBox.wx)
                        gotoViewBoxRight(1)
                    }}
                >▶️</HoldButton>
            </div>
            <HoldButton 
                className='btn-outline-secondary btn-sm mt-1' 
                disabled={viewBox.row >= patternState.pattern.length - viewBox.wy}
                onFire={() => {
                if (viewBox.row < patternState.pattern.length - viewBox.wy)
                    gotoViewBoxDown(1)
                }}
                >🔽</HoldButton>
        </div>
    )
}