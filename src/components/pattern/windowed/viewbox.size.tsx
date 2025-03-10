import { FC, useEffect } from 'react'

import { Form, InputGroup } from 'react-bootstrap'
import '../pattern.css'
import { HoldButton } from './holdbutton'
import { VIEWBOX_MIN_SIZE } from '../../../model/constats'
import { useStore } from '../../../context'
import { useStateDebounced } from '../../../services/debounce'

export const ViewBoxSizeComponent: FC = () => {

    const {
        patternState,
        viewBox,
        onChageViewBoxWidth,
        onChageViewBoxHeight
    } = useStore()

    const [width, debouncedWidth, setWidth] = useStateDebounced(viewBox.wx, 300);
    const [height, debouncedHeight, setHeight] = useStateDebounced(viewBox.wy, 300);


    useEffect(() => onChageViewBoxWidth(debouncedWidth), [debouncedWidth, onChageViewBoxWidth])
    useEffect(() => onChageViewBoxHeight(debouncedHeight), [debouncedHeight, onChageViewBoxHeight])

    return (
        <div className='mb-3'>
            <InputGroup>
                <InputGroup.Text><strong>Viewbox</strong></InputGroup.Text>
                <InputGroup.Text>width</InputGroup.Text>
                <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern[0].length} value={width}
                    onChange={(e) => { setWidth(Number(e.target.value)) }} />
                <HoldButton className='btn btn-outline-danger' onFire={() => { setWidth( Math.max(VIEWBOX_MIN_SIZE, width-1))}}>-</HoldButton>
                <HoldButton className='btn btn-outline-success' onFire={() => { setWidth( Math.max(VIEWBOX_MIN_SIZE, width+1))}}>+</HoldButton>

                <InputGroup.Text>✖️</InputGroup.Text>
                <InputGroup.Text>height</InputGroup.Text>
                <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern.length} value={height}
                    onChange={(e) => { setHeight(Number(e.target.value)) }} />
                <HoldButton className='btn btn-outline-danger' onFire={() => { setHeight( Math.max(VIEWBOX_MIN_SIZE, height-1))}}>-</HoldButton>
                <HoldButton className='btn btn-outline-success' onFire={() => { setHeight( Math.max(VIEWBOX_MIN_SIZE, height+1))}}>+</HoldButton>
            </InputGroup>
        </div>)
}