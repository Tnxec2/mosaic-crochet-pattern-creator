import { FC, useCallback, useEffect, useState } from "react";
import { useStore } from "../../context";
import Canvas from "./canvas"
import { DEFAULT_FONT_SIZE } from "../../model/constats";
import { Button, InputGroup, Modal } from "react-bootstrap";
import { ScaleFactor } from "../shared/scalefactor";
import { PatternName } from "../shared/patternname";
import { PatternDraw } from "../shared/patterndraw";
import { useStateDebounced } from "../../services/debounce";
import jsPDF from "jspdf";
import { CELL_TYPE } from "../../model/patterntype.enum";


interface PROPS {
  onClose: () => void
}

const stichTypeToWrited = (type: CELL_TYPE): string => {
  switch (type) {
    case CELL_TYPE.EMPTY:
      return 'sc';
    case CELL_TYPE.X:
      return 'dc';
    case CELL_TYPE.L:
      return 'dc left';
    case CELL_TYPE.R:
      return 'dc right';
    case CELL_TYPE.LR:
      return '(dc right, dc left)';
    case CELL_TYPE.LX:
      return '(dc, DC left)';
    case CELL_TYPE.XR:
      return '(dc right, dc)';
    case CELL_TYPE.LXR:
      return '(dc right, dc, dc left)';
    default:
      return '';
  }
}
const getStichWrited = (line: string, stichcount: number, stichtype: CELL_TYPE) => {
  return `${line.length > 0 ? ', ' : ''}${stichcount > 1 ? stichcount + ' ' : ''}${stichTypeToWrited(stichtype)}`;
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
      console.error("don't find canvas with id canvasPreview");
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

  const savePdf = useCallback(() => {
    if (canvasToSave) {
      let width = canvasToSave.width; 
      let height = canvasToSave.height;

      let pdf: jsPDF;

      //set the orientation
      if(width > height){
        pdf = new jsPDF('l', 'px', [width, height]);
      }
      else{
        pdf = new jsPDF('p', 'px', [height, width]);
      }
      //then we get the dimensions from the 'pdf' file itself
      width = pdf.internal.pageSize.getWidth();
      height = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvasToSave, 'PNG', 0, 0, width, height);
      var filename = `${patternState.name}.pdf` ;
      pdf.save(filename);
    }
  }, [canvasToSave, patternState.name])

  const writePatternToPdf = useCallback(() => {
    const pdf = new jsPDF('p', 'pt', 'a4');

    var filename = `${patternState.name}_writted.pdf`;

    var head = `<h1>${patternState.name}</h1>\n`;

    let stichtype = CELL_TYPE.EMPTY;
    let stichcount = 0;
    let line = '';
    let htmlText = ``;
    
    // process the pattern from down to up
    for (let rowIndex = patternState.pattern.length-1; rowIndex >= 0 ; rowIndex--) {
      const row = patternState.pattern[rowIndex];
      stichcount = 0;
      stichtype = CELL_TYPE.EMPTY;
      line = ``;
      for (let colIndex = row.length-1; colIndex >= 0; colIndex--) {
        const cell = row[colIndex];
        if (stichtype !== cell.type) {
          if (stichcount > 0) {
            line += getStichWrited(line, stichcount, stichtype);
          }
          stichtype = cell.type;
          stichcount = 1;
        } else {
          stichcount++;
        }
      }
      if (stichcount > 0) {
        line += getStichWrited(line, stichcount, stichtype);
      }
      htmlText += `Row ${patternState.pattern.length-rowIndex}: ` + line + '<br>\n';
    }
    console.log(htmlText);
    
    pdf.html(`<div style="width:500px;">${head}<p style="font-size: 10pt;">${htmlText}</p></div>`, {
      margin: 30,
      width: 500,
      autoPaging: 'text',
      callback: function (doc) {
        doc.save(filename);
      }
    });
  }, [patternState.pattern, patternState.name])

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
            Save Image as PNG
          </Button>
          &nbsp;
          <Button variant="danger" onClick={savePdf}>
            Save Image as PDF
          </Button>
          &nbsp;
          <Button variant="info" onClick={writePatternToPdf}>
            Save writted pattern as PDF
          </Button>
        </div>
        <div style={{ transform: `scale(${patternState.scaleFactor})`, transformOrigin: 'top left', marginTop: 10   }}>
          <Canvas
            id="canvasPreview"
            draw={draw}
            className="canva-preview"
            
          />
        </div>

      </Modal.Body>
    </Modal>

  )
}

