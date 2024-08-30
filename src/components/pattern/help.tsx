import { FC, useRef, useState } from "react"
import { Button, Overlay } from "react-bootstrap"

type Props = {}

export const Help: FC<Props> = () => {
    const [showHelp, setShowHelp] = useState(false);
    const targetHelp = useRef(null);

    return (
        <>
            <Button className='ms-3' variant="info" ref={targetHelp} onClick={() => setShowHelp(!showHelp)}>Help</Button>
            <Overlay target={targetHelp.current} show={showHelp} placement="bottom">
                {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...props
                }) => (
                    <div
                        {...props}
                        style={{
                            position: 'absolute',
                            left: 5,
                            backgroundColor: 'grey',
                            padding: '10px 10px',
                            margin: '5px',
                            color: 'white',
                            borderRadius: 5,
                            zIndex: 99999,
                            ...props.style,
                        }}
                    >
                        Ctrl + Mouse click on pattern cell = open quick menu
                    </div>
                )}
            </Overlay>
        </>
    )
} 
