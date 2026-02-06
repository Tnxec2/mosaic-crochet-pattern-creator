import { FC } from "react"
import { useStore } from "../../context"
import { Help } from "./help"
import { Card, InputGroup } from "react-bootstrap"
import { PatternName } from "../shared/patternname"
import { ScaleFactor } from "../shared/scalefactor"
import { BaselineRedo } from "../../icons/redo"
import { BaselineUndo } from "../../icons/undo"
import { UNDO_LIMIT } from "../../model/constats"

export const PatternHeaderComponent: FC = () => {
    const {
        showCellStitchType,
        setShowCellStitchType,
        isPatternWindowed,
        toggleIsPatternWindowed,
        splittedViewBox,
        toggleSplittedViewBox,
        undo,
        redo,
        past,
        future
    } = useStore((state) => state)

    return (
        <Card.Header>
            <Card.Title>
                Pattern
                <Help />
                <div className="float-end">
                    <div className="btn-group me-3" title={`maximale history ${UNDO_LIMIT} steps`}>
                        <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => {
                            undo()
                            }}
                            disabled={past.length === 0}>
                            <BaselineUndo /> Undo
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {
                            redo()
                            }}
                            disabled={future.length === 0}
                        >
                            <BaselineRedo /> Redo
                        </button>
                    </div>                    
                    <div className="form-check form-check-inline form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={isPatternWindowed}
                            onChange={(e) => {
                                toggleIsPatternWindowed()
                            }}

                        />
                        <label className="form-check-label" onClick={(e) => { toggleIsPatternWindowed() }}>view box</label>
                    </div>
                    { 
                        isPatternWindowed &&
                        <div className="form-check form-check-inline form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={splittedViewBox}
                                onChange={(e) => {
                                    toggleSplittedViewBox()
                                }}

                            />
                            <label className="form-check-label" onClick={(e) => { toggleSplittedViewBox() }}>split</label>
                        </div>
            }
                    <div className="form-check form-check-inline form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={showCellStitchType}
                            onChange={(e) => {
                                setShowCellStitchType(e.target.checked)
                            }}
                        />
                        <label className="form-check-label" onClick={(e) => { setShowCellStitchType(!showCellStitchType) }}>show stitch type</label>
                    </div>
                </div>
            </Card.Title>
            <InputGroup className="mb-3">
                <PatternName />
                <ScaleFactor />
            </InputGroup>
        </Card.Header>)
}