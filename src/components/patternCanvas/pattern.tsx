import { FC, useCallback, useRef, useState } from "react"

import Canvas from "./canvas"
import { useStore } from '../../context'
import { PatternDraw2, TSize } from "../shared/patterndraw2"
import { Card } from "react-bootstrap"
import { PatternHeaderComponent } from "../pattern/pattern.header"
import { DropDownMenu } from "./dropdownmenu"
import { IPatternGrid } from "../../model/patterncell.model"
import { BufferRowComponent } from "../pattern/buffer.row"

const cellSize = 10

export const PatternWithCanvasComponent: FC = () => {
  const {
    patternState,
    showCellStitchType,
    changeCell,
    showBufferData,
    bufferdata
  } = useStore()

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [boxSize, setBoxSize] = useState<TSize>({ 
    width: 0,
    height: 0,
    rowNumberWidth: 0,
    headerHeight: 0,
    cellSize: patternState.scaleFactor * cellSize
  });

  const [drawnState, setDrawnState] = useState<{ 
    pattern: IPatternGrid; 
    colors: string[], 
    showCellStitchType: boolean,
    fontSize: number
  }>({
    pattern: [],
    colors: [],
    showCellStitchType: false,
    fontSize: patternState.scaleFactor * cellSize
  });

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (canvas) {

      const size = PatternDraw2.drawPattern(
        patternState.pattern, patternState.colors, patternState.scaleFactor * cellSize, showCellStitchType, canvas, ctx, 
        drawnState.pattern, drawnState.colors, drawnState.showCellStitchType, drawnState.fontSize
      )
      setBoxSize(size)
      
      setDrawnState({ 
        pattern: patternState.pattern, 
        colors: patternState.colors, 
        showCellStitchType, 
        fontSize: patternState.scaleFactor * cellSize })
    } else {
      console.error("couldn't find canvas with id canvasPreview");
    }
  }, [patternState.pattern, patternState.colors, showCellStitchType, patternState.scaleFactor]);


  const [clicked, setClicked] = useState<{ row: number; col: number, x: number, y: number}>({row: -1, col: -1, x: 0, y: 0});

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {

    const { clientX, clientY } = e;
    var rect = canvas.getBoundingClientRect();
    
    // get cell from pattern based on click position
    const col = Math.floor(((clientX - rect.left) - boxSize.rowNumberWidth) / boxSize.cellSize);
    const row = Math.floor(((clientY - rect.top) - boxSize.headerHeight) / boxSize.cellSize);

    if (row >= 0 && row < patternState.pattern.length && col >= 0 && col < patternState.pattern[0].length) {
      const mouseOver = false
      if (e.ctrlKey) 
        setClicked({ row, col, x: clientX, y: clientY })
      else
        changeCell(row, col, mouseOver)
    } else {
      setClicked({ row, col, x: clientX, y: clientY })
    }
  }


  return (<>
    <DropDownMenu 
      row={clicked.row}
      col={clicked.col}
      x={clicked.x}
      y={clicked.y}
    />
    <Card className="h-100">
      <PatternHeaderComponent />
      <Card.Body className="pattern-container">
        
          <Canvas
            ref={canvasRef}
            id="canvasPreview"
            draw={draw}
            className="canvas-preview"
            onClick={handleClick}

          />
        
          { showBufferData && <div
              className="noselect mt-3"
              id="copyBuffer"
              style={{
                  display: 'flex',
                  flexDirection: 'column'
              }}
          >
              <h6>Copy Buffer</h6>
              <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  overflow: 'auto'
              }}>
                  <div>
                      {bufferdata
                          .map((row, rowIndex) => (
                              <BufferRowComponent
                                  key={`bufferRow-${rowIndex}`}
                                  row={row}
                                  rowIndex={rowIndex }
                              />
                          ))}
                  </div>
              </div>
          </div> }
      </Card.Body>
    </Card>
  </>)
}