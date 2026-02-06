import { FC, useEffect, useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import { useStore } from '../../context'
import { ACTION_TYPES, actionTitle } from '../../model/actiontype.enum'
import './actions.css'

type Props = {}
export const ActionsComponent: FC<Props> = () => {
    const { patternState, setAction, handleKeyDown } = useStore((state) => state)

    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            handleKeyDown(event);
        };
        window.addEventListener('keydown', handleKey);
    
        return () => {
            window.removeEventListener('keydown', handleKey);
        };
    }, [handleKeyDown]);

    const renderSwitch = (value: ACTION_TYPES) => {
        switch (value) {
            case ACTION_TYPES.NONE:
                return (
                    <img
                        src={`./assets/empty.svg`}
                        alt={value}
                        title={actionTitle(value)}
                    ></img>
                )
            case ACTION_TYPES.COLOR:
                return (
                    <img
                        src={`./assets/empty.svg`}
                        alt={value}
                        title={actionTitle(value)}
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
                        title={actionTitle(value)}
                    ></img>
                )
        }
    }

    const [showContent, setShowContent] = useState(true)

    return (
        <Card className='mt-2'>
            <Card.Header onClick={() => { setShowContent(!showContent) }}>
                Actions
            </Card.Header>
            {showContent &&
            <Card.Body className='p-1'>
            <Form.Group>
                <div>
                    {Object.values(ACTION_TYPES).map((value) => (
                        <button
                            type="button"
                            key={value}
                            className={`btn btn-secondary btn-sm ms-1 mb-1 ${
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
            </Card.Body> }
        </Card>
    )
}
