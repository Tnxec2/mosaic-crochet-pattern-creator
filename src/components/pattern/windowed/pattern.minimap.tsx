import { FC, MouseEvent, useCallback, useContext, useEffect } from "react"
import { PatternContext } from "../../../context"
import './pattern.minimap.css'
import { PatternDraw } from "../../shared/patterndraw"
import { useStateDebounced } from "../../../services/debounce"
import Canvas from "../../export/canvas"
import { BACKGROUND_COLOR } from "../../../model/constats"


export const PatternMinimapComponent: FC = () => {
    const {
        patternState,
        viewBox,
        gotoViewBox
    } = useContext(PatternContext)

    const [drawState, debouncedDrawState, setDrawState] = useStateDebounced<string[][]>([], 1000)


    useEffect(()=> {
        const state: string[][] = []
        for (let rowIndex = patternState.pattern.length-1; rowIndex >= 0; rowIndex--) {
            const row = patternState.pattern[rowIndex];
            const stateRow: string[] = []
            for (let colIndex = row.length-1; colIndex >= 0; colIndex--) {
                stateRow.unshift(    
                    PatternDraw.getCellColor(patternState.pattern, patternState.colors, rowIndex, colIndex)
                )
            }
            state.unshift(stateRow)
        }        
        setDrawState(state)
    }, [patternState])

    const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D)  => {
        const mapWidth = debouncedDrawState[0]?.length | 0
        const mapHeight = debouncedDrawState.length

        const scaleFactor = 1

        console.log(mapWidth, mapHeight, scaleFactor);
        
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


    const handleClick = (e: MouseEvent<HTMLElement>, ref: HTMLCanvasElement) => {
        e.preventDefault()
        
        if (ref) {
            const rect = ref.getBoundingClientRect()
            const col = e.clientX - rect.x - Math.floor(viewBox.wx / 2)
            const row = e.clientY - rect.y - Math.floor(viewBox.wy / 2)
           
            gotoViewBox(row, col);
        }
        
    }
        
    return <div className="minimap-container">
        <h2 title="click map to navigate">Minimap</h2>
        <Canvas
            id="canvasMinimap"
            draw={draw}
            className="canva-minimap"
            onClick={handleClick}
            style={{maxWidth: '100%', border: '1px solid #ccc', padding: '3px'}}
          />     
    </div>
}