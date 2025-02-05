import { FC, useContext, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import { PatternContext } from '../../context'
import { ACTION_TYPES } from '../../model/actiontype.enum'
import './actions.css'

type Props = {}
export const ActionsComponent: FC<Props> = () => {
    const { patternState, setAction, setSelectedColor } = useContext(PatternContext)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
             const key = e.key;
                
             switch (key) {
                case '1':
                    if (patternState.colors.length > 0)
                        setSelectedColor(0)
                    break;
                case '2':
                    if (patternState.colors.length > 1) setSelectedColor(1)
                    break;
                case '3':
                    if (patternState.colors.length > 2) setSelectedColor(2)
                    break;
                case '4':
                    if (patternState.colors.length > 3) setSelectedColor(3)
                    break;
                case '5':
                    if (patternState.colors.length > 4) setSelectedColor(4)
                    break;
                case '6':
                    if (patternState.colors.length > 5) setSelectedColor(5)
                    break;
                case '7':
                    if (patternState.colors.length > 6) setSelectedColor(6)
                    break;
                case '8':
                    if (patternState.colors.length > 7) setSelectedColor(7)
                    break;
                case '9':
                    if (patternState.colors.length > 8) setSelectedColor(8)
                    break;
                case '0':
                    if (patternState.colors.length > 9) setSelectedColor(9)
                    break;
                case 'x':
                    setAction(ACTION_TYPES.X) 
                    break;
                case 'X':
                    setAction(ACTION_TYPES.LXR)
                    break;
                case 'b':
                    setAction(ACTION_TYPES.LR)
                    break
                case 'l':
                    setAction(ACTION_TYPES.L)
                    break;
                case 'L':
                    setAction(ACTION_TYPES.LX)
                    break;
                case 'r':
                    setAction(ACTION_TYPES.R)
                    break;
                case 'R':
                    setAction(ACTION_TYPES.XR)
                    break;
                case 'c':
                    setAction(ACTION_TYPES.COLOR)
                    break;
                case 'Escape':
                    setAction(ACTION_TYPES.NONE)
                    break;
                default:
                    break;
             }
             
        };
        document.addEventListener('keyup', handleKeyDown, true);
    
        return () => {
            document.removeEventListener('keyup', handleKeyDown);
        };
    
    }, []);

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
