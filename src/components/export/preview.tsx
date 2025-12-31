import { FC, useCallback, useEffect, useState } from "react";
import { useStore } from "../../context";
import Canvas from "./canvas"
import { DEFAULT_FONT_SIZE } from "../../model/constats";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { ScaleFactor } from "../shared/scalefactor";
import { PatternName } from "../shared/patternname";
import { PatternDraw } from "../shared/patterndraw";
import { useStateDebounced } from "../../services/debounce";
import { usePdf } from "./usePdf";
import { useHtml } from "./useHtml";


interface PROPS {
  onClose: () => void
}



const MIN_FONT_SIZE = 6



export const PreviewComponent: FC<PROPS> = ({ onClose }) => {
  const {
    patternState,
    saveFontSize
  } = useStore((state) => state)

  const [fontSize, fontSizeDebounced, setFontSize] = useStateDebounced<number>(patternState.previewFontSize || MIN_FONT_SIZE, 300)
  const [showCellStitchType, setShowCellStitchType] = useState<boolean>(true)
  const [canvasToSave, setCanvasToSave] = useState<HTMLCanvasElement | undefined>()

  useEffect(() => {
    saveFontSize(fontSizeDebounced)
  }, [fontSizeDebounced, saveFontSize])

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (canvas) {       
      PatternDraw.drawPattern(patternState.pattern, patternState.colors, fontSizeDebounced, showCellStitchType, canvas, ctx)
      setCanvasToSave(canvas)
    } else {
      console.error("couldn't find canvas with id canvasPreview");
    }
  }, [patternState.pattern, patternState.colors, fontSizeDebounced, showCellStitchType])


  const save = useCallback(() => {
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
  }, [canvasToSave, patternState.name])

  const { savePdf, writePatternToPdf } = usePdf(canvasToSave, patternState);
  const { writePatternToHtml } = useHtml(canvasToSave, patternState);

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
                  setFontSize(Math.max(MIN_FONT_SIZE, fontSize-1))
                }}
            >
                ➖
            </Button>
            <Button
                size="sm"
                variant="outline-secondary"
                title="reset font size to default"
                onClick={() => {
                  setFontSize(DEFAULT_FONT_SIZE)
                }}
            >
                ✖ { fontSize }
            </Button>
            <Button
                size="sm"
                variant="outline-success"
                title="increase font size"
                onClick={() => {
                  setFontSize(fontSize+1)
                }}
            >
                ➕
            </Button>

            <div className="input-group-text">
              <Form.Check
                type="switch"
                id="show-stitch-type-switch"
                label="show stitch type"
                checked={showCellStitchType}
                onChange={(e) => setShowCellStitchType(e.target.checked)}
              />            
            </div>
            <ScaleFactor />
          </InputGroup>
        </div>
        <div>
          <Button variant="secondary" onClick={onClose} >
            <span className="btn-close me-3"></span> Close
          </Button>
          <Button variant="primary" onClick={save} className="ms-1">
            Save Image as PNG
          </Button>
          <Button variant="danger" onClick={savePdf} className="ms-1">
            Save Image as PDF
          </Button>
          <Button variant="info" onClick={writePatternToPdf} className="ms-1">
            Save written pattern as PDF
          </Button>
          <Button variant="secondary" onClick={writePatternToHtml} className="ms-1">
            Save written pattern as HTML
          </Button>
        </div>
        <div style={{ transform: `scale(${patternState.scaleFactor})`, transformOrigin: 'top left', marginTop: 10   }}>
          <Canvas
            id="canvasPreview"
            draw={draw}
            className="canvas-preview"
            
          />
        </div>

      </Modal.Body>
    </Modal>

  )
}
