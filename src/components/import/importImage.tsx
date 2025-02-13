import { FC, useCallback, useEffect, useState } from "react";
import { IPattern, useStore } from "../../context";
import Canvas from "./canvas"
import { Button, Modal } from "react-bootstrap";

import { useStateDebounced } from "../../services/debounce";
import { PatternImport } from "../shared/patternImport";

const DEFAULT_BRIGHTNESS = 100;
const DEFAULT_CONTRAST = 100;

interface PROPS {
  file: File,
  onClose: () => void
}

export const ImportImageComponent: FC<PROPS> = ({ file, onClose }) => {
  const savePattern = useStore((state) => state.savePattern)

  const [image, setImage] = useState<string>()
  const [imageName] = useState<string>(file.name)
  const [processPattern, setProcessPattern] = useState(true)
  const [pattern, setPattern] = useState<IPattern>()

  const [brightness, setBrightness] = useState<number>(DEFAULT_BRIGHTNESS) // 0-200
  const [contrast, setContrast] = useState<number>(DEFAULT_CONTRAST) // 0-200

  const [cutLeft, cutLeftDebounced, setCutLeft] = useStateDebounced<number>(0, 500)
  const [cutRight, cutRightDebounced, setCutRight] = useStateDebounced<number>(0, 500)
  const [cutTop, cutTopDebounced, setCutTop] = useStateDebounced<number>(0, 500)
  const [cutBottom, cutBottomDebounced, setCutBottom] = useStateDebounced<number>(0, 500)

  const [colors, colorsDebounced, setColors] = useStateDebounced<number>(4, 500)
  const [width, widthDebounced, setWidth] = useStateDebounced<number>(40, 500)
  const [height, heightDebounced, setHeight] = useStateDebounced<number>(40, 500)

  useEffect(() => {
    const url = URL.createObjectURL(file)

    setImage(url)
  }, [file])

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (canvas && image) {
      PatternImport.drawCanvas(
        image, imageName, canvas, ctx,
        brightness, contrast, colorsDebounced, widthDebounced, heightDebounced,
        cutLeftDebounced, cutRightDebounced, cutTopDebounced, cutBottomDebounced,
        processPattern, (pattern: IPattern) => { setPattern(pattern) })
    }
  }, [image, imageName, brightness, contrast, colorsDebounced, widthDebounced, heightDebounced, cutLeftDebounced, cutRightDebounced, cutTopDebounced, cutBottomDebounced, processPattern])

  return (
    <Modal fullscreen show={true}>
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title>Import Image {file.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="card">
          <div className="card-body">
            <div style={{ border: 'solid 1px lightgray', margin: 5, float: 'left', padding: 5 }} >
              <div style={{ fontSize: 'small' }}>Original</div>
              <img style={{ width: 100, paddingTop: 5 }} src={image} alt={file.name} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ border: 'solid 1px lightgray', margin: 5, padding: 5, width: 'min-content' }}>
                <Canvas
                  id="canvasImport"
                  draw={draw}
                  className="canvas-import"
                />
              </div>
              <div style={{ display: 'flex', height: 30, flex: 1 }}>
                {pattern?.colors.map((c, index) => <div key={`color-${index}`} style={{ width: 30, backgroundColor: c, border: '1px solid black' }}>&nbsp;</div>)}
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">

            <h3>Crop original image, in pixel</h3>
            <div className="input-group mb-1">
              <span className="input-group-text">Left</span>
              <input type="number" className="form-control" id="cutLeft" min={1} value={cutLeft} onChange={(e) => setCutLeft(Number(e.target.value))} />
              <span className="input-group-text">Top</span>
              <input type="number" className="form-control" id="cutTop" min={1} value={cutTop} onChange={(e) => setCutTop(Number(e.target.value))} />
              <span className="input-group-text">Right</span>
              <input type="number" className="form-control" id="cutRight" min={1} value={cutRight} onChange={(e) => setCutRight(Number(e.target.value))} />
              <span className="input-group-text">Bottom</span>
              <input type="number" className="form-control" id="cutBottom" min={1} value={cutBottom} onChange={(e) => setCutBottom(Number(e.target.value))} />
              <button className="btn btn-outline-danger" type="button" title="reset crop dimensions"
                onClick={() => {
                  setCutLeft(0)
                  setCutRight(0)
                  setCutTop(0)
                  setCutBottom(0)
                }}
              >✖</button>
            </div>

            <h3>Change color</h3>
            <div className="input-group mb-1">
              <span className="input-group-text">Brightness</span>
              <input type="range" className="form-control" id="brightnessRange"
                min={0} max={200} step={10}
                value={brightness} onChange={(e) => setBrightness(Number(e.target.value))}
              />
              <span className="input-group-text">{brightness}</span>
              <button className="btn btn-outline-danger" type="button" title="reset brightness to default"
                onClick={() => { setBrightness(DEFAULT_BRIGHTNESS) }}
              >✖</button>
            </div>
            <div className="input-group mb-1">
              <span className="input-group-text">Contrast</span>
              <input type="range" className="form-control" id="contrastRange"
                min={0} max={200} step={10}
                value={contrast} onChange={(e) => setContrast(Number(e.target.value))}
              />
              <span className="input-group-text">{contrast}</span>
              <button className="btn btn-outline-danger" type="button" title="reset contrast to default"
                onClick={() => { setContrast(DEFAULT_CONTRAST) }}
              >✖</button>
            </div>
            <div className="input-group mb-1">
              <span className="input-group-text">Colors</span>
              <input type="number" className="form-control" id="colorsCount" min={1} max={255} step={1} value={colors} onChange={(e) => setColors(Number(e.target.value))} />
            </div>

            <h3>Set pattern size</h3>
            <div className="input-group mb-1">
              <span className="input-group-text">Width</span>
              <input type="number" className="form-control" id="width" min={10} step={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
              <span className="input-group-text">x</span>
              <span className="input-group-text">Height</span>
              <input type="number" className="form-control" id="height" min={1} step={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
            </div>
            <div className="input-group mb-1">
              <span className="input-group-text" onClick={() => {
                setProcessPattern(!processPattern)
              }}>Process pattern</span>
              <div className="input-group-text">
                <input type="checkbox" className="form-check-input" id="processPattern" checked={processPattern} onChange={(e) => setProcessPattern(e.target.checked)} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          &nbsp;
          <Button variant="primary" onClick={() => {
            if (pattern) {
              if (window.confirm('Do you really want to accept this pattern? All other changes in the main program will be lost.'))
                savePattern(pattern)
              onClose();
            }
          }}>
            Accept this pattern
          </Button>
        </div>
      </Modal.Body>
    </Modal>

  )
}

