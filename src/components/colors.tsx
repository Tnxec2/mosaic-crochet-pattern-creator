import { ChangeEvent, FC, useContext } from 'react'
import { Form } from 'react-bootstrap'
import { PatternContext } from '../context'
import { DEFAULT_COLOR } from '../model/constats'
import { ACTION_TYPES } from '../model/actiontype.enum'

type Props = {}

export const ColorsComponent: FC<Props> = () => {
    const { patternState, savePattern } = useContext(PatternContext)

    const changeColor = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        let newColor = e.target.value
        if (patternState.colors.includes(newColor)) return

        savePattern({
            ...patternState,
            pattern: patternState.pattern.map((r) =>
                r.map((c) =>
                    c.colorindex === index ? { ...c, colorindex: index } : c
                )
            ),
            colors: patternState.colors.map((c, i) =>
                i === index ? newColor : c
            )
        })
    }

    const addColor = () => {
        savePattern({
            ...patternState,
            colors: [...patternState.colors, DEFAULT_COLOR]
        })
    }

    const setSelectedColor = (index: number) => {
        savePattern({
            ...patternState,
            selectedColorIndex: index,
            selectedAction: ACTION_TYPES.COLOR
        })
    }

    const deleteColor = (index: number) => {
        savePattern({
            ...patternState,
            colors: patternState.colors.filter((c, i) => i !== index)
        })
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Colors</Form.Label>
                {patternState.colors.map((color, index) => (
                    <div key={`color-${index}`} className="input-group">
                        <input
                            type="color"
                            className="form-control form-control-sm"
                            title="color"
                            value={color}
                            onChange={(e) => changeColor(e, index)}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={(e) => setSelectedColor(index)}
                            disabled={patternState.selectedColorIndex === index}
                        >
                            {patternState.selectedColorIndex === index
                                ? '✔'
                                : 'set'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => deleteColor(index)}
                            disabled={patternState.colors.length <= 1}
                        >
                            ❌
                        </button>
                    </div>
                ))}
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
