import { FC, useContext } from 'react'
import { Form } from 'react-bootstrap'
import { PatternContext } from '../context'
import { ACTION_TYPES } from '../model/actiontype.enum'
import './actions.css'

type Props = {}
export const ActionsComponent: FC<Props> = () => {
    const { patternState, savePattern } = useContext(PatternContext)

    const setAction = (action: ACTION_TYPES) => {
        savePattern({ ...patternState, selectedAction: action })
    }

    const renderSwitch = (value: ACTION_TYPES) => {
        switch (value) {
            case ACTION_TYPES.NONE:
                return (
                    <img
                        src={`./assets/empty.svg`}
                        alt={value}
                        title="Empty"
                    ></img>
                )
            case ACTION_TYPES.COLOR:
                return (
                    <img
                        src={`./assets/empty.svg`}
                        alt={value}
                        title="Color"
                        style={{
                            backgroundColor:
                                patternState.colors[
                                    patternState.selectedColorIndex
                                ]
                        }}
                    ></img>
                )
            default:
                return (
                    <img
                        src={`./assets/${value}.svg`}
                        alt={value}
                        title={value.toUpperCase()}
                    ></img>
                )
        }
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Actions</Form.Label>
                <div>
                    {Object.values(ACTION_TYPES).map((value) => (
                        <button
                            type="button"
                            key={value}
                            className={`btn btn-outline-info btn-sm ms-1 mb-1 ${
                                patternState.selectedAction === value
                                    ? 'selected-action'
                                    : ''
                            }`}
                            onClick={(e) => setAction(value)}
                        >
                            {renderSwitch(value)}
                        </button>
                    ))}
                </div>
            </Form.Group>
        </>
    )
}
