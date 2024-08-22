import { FC, useContext } from "react"
import { PatternContext } from "../../context"
import { Form } from "react-bootstrap"

type Props = {}

export const PropertiesComponent: FC<Props> = () => {
    const { mirrorVertical, setMirrorVertical, mirrorHorizontal, setMirrorHorizontal, toggleStitch, setToggleStitch } = useContext(PatternContext)

    return (
        <>            
        <Form.Group className="mb-3">
            <Form.Label>Properties</Form.Label>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={toggleStitch}
                    onChange={(e) => {
                        setToggleStitch(e.target.checked)
                    }}
                />
                <label
                    className="form-check-label"
                >
                    toggle stitch
                </label>
            </div>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={mirrorVertical}
                    onChange={(e) => {
                        setMirrorVertical(e.target.checked)
                    }}
                />
                <label
                    className="form-check-label"
                >
                    mirror vertical
                </label>
            </div>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={mirrorHorizontal}
                    onChange={(e) => {
                        setMirrorHorizontal(e.target.checked)
                    }}
                />
                <label
                    className="form-check-label"
                >
                    mirror horizontal
                </label>
            </div>
        </Form.Group> 
        </>
    )
}