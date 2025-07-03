import { FC, useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import { useStore } from '../../context'
import { ColorItemComponent } from './coloritem'

type Props = {}

export const ColorsComponent: FC<Props> = () => {
    const { patternState, changeColor, setSelectedColor, addColor, deleteColor } = useStore((state) => state)

    const [showContent, setShowContent] = useState(true)

    return (
        <Card className='mt-2'>
            <Card.Header onClick={() => { setShowContent(!showContent) }}>
                <Form.Label>Colors</Form.Label>
            </Card.Header>
            {showContent &&
                <Card.Body className='p-1'>
                    <Form.Group className="mb-1">
                        {patternState.colors.map((color, index) =>
                            <ColorItemComponent
                                key={`${patternState.name}-${index}`}
                                colorIndex={index}
                                color={color}
                                changeColor={changeColor}
                                setSelectedColor={setSelectedColor}
                                deleteColor={deleteColor}
                                selected={patternState.selectedColorIndex === index}
                                canByDeleted={patternState.colors.length <= 1}
                            />
                        )}
                        <button
                            type="button"
                            className="btn btn-outline-success mt-1 btn-sm"
                            onClick={addColor}
                        >
                            add
                        </button>
                    </Form.Group>
                </Card.Body>
            }
        </Card>
    )
}
