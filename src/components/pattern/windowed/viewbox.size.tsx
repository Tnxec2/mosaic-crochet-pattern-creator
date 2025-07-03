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
        viewBox2,
        splittedViewBox,
        onChageViewBoxWidth,
        onChageViewBoxHeight
    } = useStore()

    const [width, debouncedWidth, setWidth] = useStateDebounced(viewBox.wx, 300);
    const [height, debouncedHeight, setHeight] = useStateDebounced(viewBox.wy, 300);

    useEffect(() => onChageViewBoxWidth(debouncedWidth), [debouncedWidth, onChageViewBoxWidth])
    useEffect(() => onChageViewBoxHeight(debouncedHeight), [debouncedHeight, onChageViewBoxHeight])

    const [width2, debouncedWidth2, setWidth2] = useStateDebounced(viewBox2.wx, 300);
    const [height2, debouncedHeight2, setHeight2] = useStateDebounced(viewBox2.wy, 300);

    useEffect(() => onChageViewBoxWidth(debouncedWidth2, 2), [debouncedWidth2, onChageViewBoxWidth])
    useEffect(() => onChageViewBoxHeight(debouncedHeight2, 2), [debouncedHeight2, onChageViewBoxHeight])

    return (
        <>
            <div>
                <InputGroup>
                    <InputGroup.Text><strong>Viewbox</strong></InputGroup.Text>
                    <InputGroup.Text>width</InputGroup.Text>
                    <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern[0].length} value={width}
                        onChange={(e) => { setWidth(Number(e.target.value)) }} />
                    <HoldButton className='btn btn-outline-danger' onFire={() => { setWidth(Math.max(VIEWBOX_MIN_SIZE, width - 1)) }}>-</HoldButton>
                    <HoldButton className='btn btn-outline-success' onFire={() => { setWidth(Math.max(VIEWBOX_MIN_SIZE, width + 1)) }}>+</HoldButton>

                    <InputGroup.Text>✖️</InputGroup.Text>
                    <InputGroup.Text>height</InputGroup.Text>
                    <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern.length} value={height}
                        onChange={(e) => { setHeight(Number(e.target.value)) }} />
                    <HoldButton className='btn btn-outline-danger' onFire={() => { setHeight(Math.max(VIEWBOX_MIN_SIZE, height - 1)) }}>-</HoldButton>
                    <HoldButton className='btn btn-outline-success' onFire={() => { setHeight(Math.max(VIEWBOX_MIN_SIZE, height + 1)) }}>+</HoldButton>
                </InputGroup>
            </div>
            {splittedViewBox &&
                <div>
                    <InputGroup>
                        <InputGroup.Text><strong>Viewbox 2</strong></InputGroup.Text>
                        <InputGroup.Text>width</InputGroup.Text>
                        <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern[0].length} value={width2}
                            onChange={(e) => { setWidth2(Number(e.target.value)) }} />
                        <HoldButton className='btn btn-outline-danger' onFire={() => { setWidth2(Math.max(VIEWBOX_MIN_SIZE, width2 - 1)) }}>-</HoldButton>
                        <HoldButton className='btn btn-outline-success' onFire={() => { setWidth2(Math.max(VIEWBOX_MIN_SIZE, width2 + 1)) }}>+</HoldButton>

                        <InputGroup.Text>✖️</InputGroup.Text>
                        <InputGroup.Text>height</InputGroup.Text>
                        <Form.Control type='number' min={VIEWBOX_MIN_SIZE} max={patternState.pattern.length} value={height2}
                            onChange={(e) => { setHeight2(Number(e.target.value)) }} />
                        <HoldButton className='btn btn-outline-danger' onFire={() => { setHeight2(Math.max(VIEWBOX_MIN_SIZE, height2 - 1)) }}>-</HoldButton>
                        <HoldButton className='btn btn-outline-success' onFire={() => { setHeight2(Math.max(VIEWBOX_MIN_SIZE, height2 + 1)) }}>+</HoldButton>
                    </InputGroup>
                </div>
            }
        </>
    )
}