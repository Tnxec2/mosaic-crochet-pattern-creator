import { FC, useState } from "react"

import { useStore } from '../../context'
import { Card } from "react-bootstrap"
import { PatternHeaderComponent } from "../pattern/pattern.header"
import { DropDownMenu } from "./dropdownmenu"
import { BufferRowComponent } from "../pattern/buffer.row"
import { ViewBoxSizeComponent } from "../pattern/windowed/viewbox.size"
import { BoxedCanvasComponent } from "./boxedCanvas"



export const PatternWindowedWithCanvasComponent: FC = () => {
  const {
    showBufferData,
    bufferdata,
    viewBox,
    viewBox2,
    splittedViewBox,
    gotoViewBoxUp,
    gotoViewBoxDown,
    gotoViewBoxLeft,
    gotoViewBoxRight,
  } = useStore()

  const [clicked, setClicked] = useState<{ row: number; col: number, x: number, y: number }>({ row: -1, col: -1, x: 0, y: 0 });


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

        <ViewBoxSizeComponent />

        <div className='mt-3 d-flex flex-row'
        >
          <BoxedCanvasComponent 
            viewBox={{...viewBox}}
            onClicked={setClicked}
            gotoViewBoxUp={(step) => { gotoViewBoxUp(step, 1); }}
            gotoViewBoxDown={(step) => { gotoViewBoxDown(step, 1); }}
            gotoViewBoxLeft={(step) => { gotoViewBoxLeft(step, 1); }}
            gotoViewBoxRight={(step) => { gotoViewBoxRight(step, 1); }}
          />
          {splittedViewBox &&
            <div className="ms-3">
            <BoxedCanvasComponent 
              viewBox={{...viewBox2}}
              onClicked={setClicked}
              gotoViewBoxUp={(step) => { gotoViewBoxUp(step, 2); }}
              gotoViewBoxDown={(step) => { gotoViewBoxDown(step, 2); }}
              gotoViewBoxLeft={(step) => { gotoViewBoxLeft(step, 2); }}
              gotoViewBoxRight={(step) => { gotoViewBoxRight(step, 2); }}
            />
            </div>
          }
        </div>

        {showBufferData && <div
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
                    rowIndex={rowIndex}
                  />
                ))}
            </div>
          </div>
        </div>}
      </Card.Body>
    </Card>
  </>)
}