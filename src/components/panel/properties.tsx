import { FC, useState } from "react"
import { useStore } from "../../context"
import { Card, Form } from "react-bootstrap"

type Props = {}

export const PropertiesComponent: FC<Props> = () => {
    const { mirrorVertical, setMirrorVertical, mirrorHorizontal, setMirrorHorizontal, toggleStitch, setToggleStitch } = useStore((state) => state)

    const [showContent, setShowContent] = useState(true)

    return (
        <Card className='mt-2'>
            <Card.Header onClick={() => { setShowContent(!showContent) }}>
                Properties
            </Card.Header>
            {showContent &&
            <Card.Body className='p-1'>           
        <Form.Group className="mb-3">
            <div className="form-check form-switch" title="Toggle stitch [t]">
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
                    onClick={(e) => {
                        setToggleStitch(!toggleStitch)
                    }}
                >
                    toggle stitch
                </label>
            </div>
            <div className="form-check form-switch" title="Mirror vertical [v]">
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
                    onClick={(e) => {
                        setMirrorVertical(!mirrorVertical)
                    }}
                >
                    ↔️ mirror vertical
                </label>
            </div>
            <div className="form-check form-switch" title="Mirror horizontal [h]">
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
                    onClick={(e) => {
                        setMirrorHorizontal(!mirrorHorizontal)
                    }}
                >
                    ↕️ mirror horizontal
                </label>
            </div>
        </Form.Group> 
        </Card.Body>

            }
        </Card>
    )
}