import { FC } from "react"
import { useStore } from "../../context"
import { Help } from "./help"
import { Card, InputGroup } from "react-bootstrap"
import { PatternName } from "../shared/patternname"
import { ScaleFactor } from "../shared/scalefactor"

export const PatternHeaderComponent: FC = () => {
    const {
        showCellStitchType,
        setShowCellStitchType,
    } = useStore((state) => state)

    return (
        <Card.Header>
            <Card.Title>
                Pattern
                <Help />
                <div className="form-check form-switch float-end">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        checked={showCellStitchType}
                        onChange={(e) => {
                            setShowCellStitchType(e.target.checked)
                        }}
                    />
                    <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault"
                    >
                        show stitch type
                    </label>
                </div>
            </Card.Title>
            <InputGroup className="mb-3">
                <PatternName />
                <ScaleFactor />
            </InputGroup>
        </Card.Header>)
}