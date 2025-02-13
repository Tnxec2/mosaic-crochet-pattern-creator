import { FC, useContext } from 'react'
import { Form } from 'react-bootstrap'
import { useStore } from '../../context'
import { ColorItemComponent } from './coloritem'

type Props = {}

export const ColorsComponent: FC<Props> = () => {
    const { patternState, changeColor, setSelectedColor, addColor, deleteColor } = useStore((state) => state)
  
    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Colors</Form.Label>
                {patternState.colors.map((color, index) => 
                    <ColorItemComponent 
                    key={`${patternState.name}-${index}`}
                    colorIndex={index}
                    color={color}
                    changeColor={changeColor}
                    setSelectedColor={setSelectedColor}
                    deleteColor={deleteColor}
                    selected = {patternState.selectedColorIndex === index}
                    canByDeleted = {patternState.colors.length <= 1}
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
        </>
    )
}
