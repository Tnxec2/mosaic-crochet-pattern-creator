import { FC, useContext, useEffect, useRef, useState } from "react"
import { ButtonGroup, Button, Form, InputGroup } from "react-bootstrap"
import { PatternContext } from "../../context"
import { UNKNOWN_NAME } from "../../model/constats"



export const PatternName: FC = () => {
    const {
        patternState,
        savePattern,
    } = useContext(PatternContext)

    const [edit, setEdit] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (edit) {
            inputRef?.current?.focus()
            if (patternState.name === UNKNOWN_NAME) inputRef?.current?.setSelectionRange(0, patternState.name.length)
        } else {
            if (patternState.name.trim() === '') savePattern({...patternState, name: UNKNOWN_NAME})
        } 
    }, [edit])


    return (
        <>
            <InputGroup.Text 
                title={patternState.name} >Name</InputGroup.Text>            
            <ButtonGroup className="float-end">
                <Button
                    size="sm"
                    variant="outline-primary"
                    title={edit ? 'ok' : 'edit'}
                    onClick={() => {
                        setEdit(!edit)
                    }}
                >
                    {edit ? '✖' : '✏️'}
                </Button>
            </ButtonGroup>
            <Form.Control
                style={{minWidth: 100}}
                type="text"
                title={patternState.name} 
                placeholder="pattern name"
                value={patternState.name}
                onChange={(e) => savePattern({ ...patternState, name: e.target.value })}
                ref={inputRef}
                disabled={!edit}
                autoFocus
            />

        </>
    )

}
