import { FC, useCallback, useRef, useState } from "react"

import Canvas from "./canvas"
import { useStore } from '../../context'
import { PatternDraw2, TSize } from "../shared/patterndraw2"
import { Card } from "react-bootstrap"
import { PatternHeaderComponent } from "../pattern/pattern.header"
import { DropDownMenu } from "./dropdownmenu"
import { IPatternGrid } from "../../model/patterncell.model"
import { BufferRowComponent } from "../pattern/buffer.row"
import { useStateDebounced } from "../../services/debounce"

const cellSize = 10

const getCoords = (
      e: React.MouseEvent<HTMLCanvasElement>,
      boxSize: TSize
  ) => {
      const { clientX, clientY } = e;
      var rect = e.currentTarget.getBoundingClientRect();
      
      // get cell from pattern based on click position
      const col = Math.floor(((clientX - rect.left) - boxSize.rowNumberWidth) / boxSize.cellSize);
      const row = Math.floor(((clientY - rect.top) - boxSize.headerHeight) / boxSize.cellSize);
      return { row, col };
  }

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
      const fontSize = patternState.scaleFactor * cellSize
      const size = PatternDraw2.drawPattern(
        patternState.pattern, patternState.colors, fontSize, showCellStitchType, canvas, ctx, 
        drawnState.pattern, drawnState.colors, drawnState.showCellStitchType, drawnState.fontSize
      )
      setBoxSize(size)
      
      setDrawnState({ 
        pattern: patternState.pattern, 
        colors: patternState.colors, 
        showCellStitchType, 
        fontSize: fontSize })
    } else {
      console.error("couldn't find canvas with id canvasPreview");
    }
  }, [patternState.pattern, patternState.colors, patternState.scaleFactor, showCellStitchType]);


  const [clicked, setClicked] = useState<{ row: number; col: number, x: number, y: number}>({row: -1, col: -1, x: 0, y: 0});

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>, mouseOver: boolean) => {
    
    const { clientX, clientY } = e;
    const { row, col } = getCoords(e, boxSize);
    
    if (row >= 0 && row < patternState.pattern.length && col >= 0 && col < patternState.pattern[0].length) {
      if (e.ctrlKey) 
        setClicked({ row, col, x: clientX, y: clientY })
      else
        changeCell(row, col, mouseOver)
    } else {
      const r = row < 0 || row > patternState.pattern.length - 1 ? -1 : row 
      const c = col < 0 || col > patternState.pattern[0].length - 1 ? -1 : col
      
      setClicked({ row: r, col: c, x: clientX, y: clientY })
    }
  }, [boxSize, patternState.pattern, changeCell]);


  const [mouseOverCell, setMouseOverCell] = useState<{ row: number; col: number}>({row: -1, col: -1});

  const handleMouseOver = useCallback((
      e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

      const { row, col } = getCoords(e, boxSize);

      if (row !== mouseOverCell.row || col !== mouseOverCell.col) {
        setMouseOverCell({ row, col });
        if (e.buttons === 1) {
          console.log('mouse over click');
          
          handleClick(e, true)
        }
      } else {
        return;
      }
  }, [handleClick, boxSize, mouseOverCell]);


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
            onClick={(e: React.MouseEvent<HTMLCanvasElement>) => {handleClick(e, false)}}
            onMouseMove={(e: React.MouseEvent<HTMLCanvasElement>) => {handleMouseOver(e)}}
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