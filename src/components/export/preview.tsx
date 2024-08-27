import { FC, useContext, useState } from "react";
import { PatternContext } from "../../context";
import Canvas from "./canvas"
import { BACKGROUND_COLOR, DEFAULT_FONT_SIZE } from "../../model/constats";
import { Button, InputGroup, Modal } from "react-bootstrap";
import { CELL_TYPE } from "../../model/patterntype.enum";
import { ScaleFactor } from "../shared/scalefactor";
import { PatternName } from "../shared/patternname";
import { DRAW } from "./draw";


interface PROPS {
  onClose: () => void
}

const MIN_FONT_SIZE = 10

export const PreviewComponent: FC<PROPS> = ({ onClose }) => {
  const {
    patternState,
    savePattern,
    getCellColor
  } = useContext(PatternContext)

  const [fontSize, setFontSize] = useState<number>(patternState.previewFontSize || MIN_FONT_SIZE )
  const [showCellStitchType, setShowCellStitchType] = useState<boolean>(true)
  const [width, setWidth] = useState<number>(100)
  const [height, setHeight] = useState<number>(100)
  const [canvasToSave, setCanvasToSave] = useState<HTMLCanvasElement | undefined>()

  function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (canvas) {
      setCanvasToSave(canvas)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPattern(canvas, ctx)
    } else {
      console.error("don't find canvas with id canvasPreview");
    }
  }

  function drawPattern(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const rows = patternState.pattern.length
    const cols = patternState.pattern[0].length
    const max = Math.max(rows, cols)

    ctx.font = `normal ${fontSize}pt monospace`
    let metrics = ctx.measureText(max.toString());
    let cellSize = metrics.width + 4

    console.log(max, cellSize);

    let w = cellSize * (cols + 2)
    setWidth(w)
    let h = cellSize * (rows + 2)
    setHeight(h)

    ctx.font = `normal ${fontSize}pt monospace`

    var cellColor = BACKGROUND_COLOR

    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, w, h)
    ctx.lineWidth = 1

    // pattern content
    for (let r = rows - 1; r >= 0; r--) {
      const row = patternState.pattern[r]
      for (let c = 0; c < row.length; c++) {
        cellColor = getCellColor(r, c)

        let x = (c + 1) * cellSize
        let y = (r + 1) * cellSize

        ctx.fillStyle = cellColor
        ctx.fillRect(x, y, cellSize, cellSize)

        if (showCellStitchType && row[c].type !== CELL_TYPE.EMPTY) {
          let image = DRAW.draw(cellSize-4, row[c].type )
          if (image) ctx.drawImage(image, x+2, y+2)
        }
      }
    }

    // rows, cols numbers
    ctx.fillStyle = "black"
    ctx.textBaseline = "top"

    for (let r = 1; r <= rows; r++) {
      let y = h - (r+1) * cellSize
      ctx.fillText(r.toString(), 2, y+2) // left
      ctx.fillText(r.toString(), w - cellSize + 2, y+2) // right
    }

    for (let c = 1; c <= cols; c++) {
      let x = w - (c+1) * cellSize
      ctx.fillText(c.toString(), x + 2, 2) // top
      ctx.fillText(c.toString(), x + 2, h - cellSize + 2) // bottom
    }

    // grid
    for (let r = 0; r <= rows; r++) {
      let y = (r + 1) * cellSize
      drawLine(ctx, [0, y], [w, y])
      for (let c = 0; c <= cols; c++) {
        let x = (c + 1) * cellSize
        drawLine(ctx, [x, 0], [x, h])
      }
    }
  }

  function drawLine(
    ctx: CanvasRenderingContext2D,
    begin: [number, number],
    end: [number, number],
    stroke = "black",
    width = 1
  ) {
    if (stroke) {
      ctx.strokeStyle = stroke;
    }

    if (width) {
      ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(begin[0], begin[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
  }

  function save() {
    if (canvasToSave) {
      var image = canvasToSave.toDataURL();

      var aDownloadLink = document.createElement('a');

      var filename = `${patternState.name}.png` ;
      // Add the name of the file to the link
      aDownloadLink.download = filename;
      // Attach the data to the link
      aDownloadLink.href = image;
      // Get the code to click the download link
      aDownloadLink.click();
    }
  }

  function changeFontSize(size: number) {
    setFontSize(size)
  
    savePattern( {...patternState, previewFontSize: size} )
  }

  return (
    <Modal fullscreen show={true}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>Save Pattern</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h2>Check preview and save image</h2>

        <div>
          <InputGroup className="mb-3">
            <PatternName />
            <InputGroup.Text>Font size</InputGroup.Text>
            <Button
                size="sm"
                variant="outline-danger"
                title="decrease font size"
                onClick={() => {
                  changeFontSize(Math.max(MIN_FONT_SIZE, fontSize-1))
                }}
            >
                ➖
            </Button>
            <Button
                size="sm"
                variant="outline-secondary"
                title="reset font size to default"
                onClick={() => {
                    changeFontSize(DEFAULT_FONT_SIZE)
                }}
            >
                ✖ { fontSize }
            </Button>
            <Button
                size="sm"
                variant="outline-success"
                title="increase font size"
                onClick={() => {
                  changeFontSize(fontSize+1)
                }}
            >
                ➕
            </Button>

            <InputGroup.Text onClick={(e) => {
              setShowCellStitchType(!showCellStitchType)
            }}>show stitch type</InputGroup.Text>
            <InputGroup.Checkbox

              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={showCellStitchType}
              onChange={(e) => {
                setShowCellStitchType(e.target.checked)
              }}
            />

            <ScaleFactor />
          </InputGroup>
        </div>
        <div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          &nbsp;
          <Button variant="primary" onClick={save}>
            Save
          </Button>
        </div>
        <div style={{ transform: `scale(${patternState.scaleFactor})`, transformOrigin: 'top left', marginTop: 10   }}>
          <Canvas
            id="canvasPreview"
            draw={draw}
            className="canva-preview"
            width={width}
            height={height}
          />
        </div>

      </Modal.Body>
    </Modal>

  )
}

