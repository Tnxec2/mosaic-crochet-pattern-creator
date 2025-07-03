import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from "react"
import { useStore } from "../../../context"
import './pattern.minimap.css'
import { PatternDraw } from "../../shared/patterndraw"
import { useStateDebounced } from "../../../services/debounce"
import Canvas from "../../export/canvas"
import { BACKGROUND_COLOR, MINMAP_FRAME, MINMAP_FRAME2 } from "../../../model/constats"
import { Card, Form } from "react-bootstrap"



export const PatternMinimapComponent: FC = () => {
    const {
        patternState,
        viewBox,
        viewBox2,
        gotoViewBox,
        isPatternWindowed,
        splittedViewBox
    } = useStore((state) => state)

    const [drawState, debouncedDrawState, setDrawState] = useStateDebounced<string[][]>([], 1000)

    const minimapCanvasRef = useRef<HTMLCanvasElement | null>(null)

    const [showFrame, setShowFrame] = useState(true)
    const [showContent, setShowContent] = useState(true)


    useEffect(() => {
        const state: string[][] = []
        for (let rowIndex = patternState.pattern.length - 1; rowIndex >= 0; rowIndex--) {
            const row = patternState.pattern[rowIndex];
            const stateRow: string[] = []
            for (let colIndex = row.length - 1; colIndex >= 0; colIndex--) {
                stateRow.unshift(
                    PatternDraw.getCellColor(patternState.pattern, patternState.colors, rowIndex, colIndex)
                )
            }
            state.unshift(stateRow)
        }
        setDrawState(state)
    }, [patternState])

    const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        minimapCanvasRef.current = canvas

        const mapWidth = debouncedDrawState[0]?.length | 0
        const mapHeight = debouncedDrawState.length

        const scaleFactor = 1

        if (scaleFactor) {

            canvas.width = mapWidth * scaleFactor
            canvas.height = mapHeight * scaleFactor

            ctx.fillStyle = BACKGROUND_COLOR
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let rowIndex = 0; rowIndex < debouncedDrawState.length; rowIndex++) {
                const row = debouncedDrawState[rowIndex];
                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const colorString = row[colIndex];
                    ctx.fillStyle = colorString
                    ctx.fillRect(colIndex * scaleFactor, rowIndex * scaleFactor, 1, 1)
                }
            }
        }

    }, [debouncedDrawState])

    const drawFrame = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        if (minimapCanvasRef.current) {
            const mapWidth = minimapCanvasRef.current?.width
            const mapHeight = minimapCanvasRef.current?.height

            const scaleFactor = 1

            if (scaleFactor) {
                canvas.width = mapWidth * scaleFactor
                canvas.height = mapHeight * scaleFactor

                ctx.strokeStyle = MINMAP_FRAME
                ctx.lineWidth = 2
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                ctx.strokeRect(
                    viewBox.col * scaleFactor,
                    viewBox.row * scaleFactor,
                    Math.min(mapWidth, viewBox.wx) * scaleFactor,
                    Math.min(mapHeight, viewBox.wy * scaleFactor)
                )

                if (splittedViewBox) {
                    ctx.strokeStyle =  MINMAP_FRAME2
                    ctx.strokeRect(
                        viewBox2.col * scaleFactor,
                        viewBox2.row * scaleFactor,
                        Math.min(mapWidth, viewBox2.wx) * scaleFactor,
                        Math.min(mapHeight, viewBox2.wy * scaleFactor))
                }
            }
        }

    }, [viewBox, viewBox2, splittedViewBox, minimapCanvasRef])


    const handleClick = (e: MouseEvent<HTMLElement>, ref: HTMLCanvasElement) => {
        e.preventDefault()

        if (ref) {
            const rect = ref.getBoundingClientRect()
            const xFactor = rect.width / (e.clientX - rect.x)
            const yFactor = rect.height / (e.clientY - rect.y)
            console.log(e.getModifierState('Control'));

            if (splittedViewBox && e.getModifierState('Control')) {
                var row2 = Math.floor(patternState.pattern.length / yFactor - viewBox2.wy / 2)
                var col2 = Math.floor(patternState.pattern[0].length / xFactor - viewBox2.wx / 2)

                if (patternState.pattern.length - row2 < viewBox2.wy) row2 = patternState.pattern.length - viewBox2.wy - 1
                if (patternState.pattern[0].length - col2 < viewBox2.wx) col2 = patternState.pattern[0].length - viewBox2.wx - 1

                gotoViewBox(row2, col2, 2);
            } else {
                var row = Math.floor(patternState.pattern.length / yFactor - viewBox.wy / 2)
                var col = Math.floor(patternState.pattern[0].length / xFactor - viewBox.wx / 2)

                if (patternState.pattern.length - row < viewBox.wy) row = patternState.pattern.length - viewBox.wy - 1
                if (patternState.pattern[0].length - col < viewBox.wx) col = patternState.pattern[0].length - viewBox.wx - 1

                gotoViewBox(row, col);
            }
        }
    }

    return (
        <Card className="minimap-container mb-2">
            <Card.Header className="d-flex" onClick={() => { setShowContent(!showContent) }}>
                <Form.Label style={{ flex: 1 }}>Minimap</Form.Label>

                {isPatternWindowed && <div className="form-check form-check-inline form-switch m-0" onClick={(e) => {
                            e.stopPropagation();
                            setShowFrame(!showFrame)
                        }}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={showFrame}
                        title="toggle frame"
                    />
                </div>}
            </Card.Header>
            {showContent &&
                <Card.Body className="wrapper-minmap p-0" >
                    <Canvas
                        id="canvasMinimap"
                        draw={draw}
                        className="canvas-minimap"
                        onClick={handleClick}
                    />
                    {showFrame && isPatternWindowed &&
                        <Canvas
                            id="canvasMinimapFrame"
                            draw={drawFrame}
                            className="canvas-minimap-frame"
                            onClick={handleClick}
                            title={splittedViewBox ? 'click to move first frame, to move second frame press control keyi and click' : 'click to move the frame'}
                        />
                    }
                </Card.Body>
            }
        </Card>
    )
}