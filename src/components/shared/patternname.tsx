import { FC, useEffect, useRef, useState } from "react"
import { ButtonGroup, Button, Form, InputGroup } from "react-bootstrap"
import { useStore } from "../../context"
import { UNKNOWN_NAME } from "../../model/constats"



export const PatternName: FC = () => {
    const {
        patternState,
        changeName,
    } = useStore((state) => state)

    const [edit, setEdit] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [ name, setName ] = useState(patternState.name);

    useEffect(() => {
        setName(patternState.name)
    }, [patternState.name])

    useEffect(() => {
        if (edit) {
            inputRef?.current?.focus()
            if (patternState.name === UNKNOWN_NAME) inputRef?.current?.setSelectionRange(0, patternState.name.length)
        } 
    }, [edit, patternState])


    return (
        <>
            <InputGroup.Text 
                title={patternState.name} >Name</InputGroup.Text>            
            <ButtonGroup className="float-end">
               { !edit && <Button
                    size="sm"
                    variant="outline-primary"
                    title={edit ? 'ok' : 'edit'}
                    onClick={() => {
                        setEdit(!edit)
                    }}
                >
                    ✏️
                </Button> }
                { edit && <Button
                    size="sm"
                    variant="outline-primary"
                    title={edit ? 'ok' : 'edit'}
                    onClick={() => {
                        setEdit(!edit)
                        changeName(name.trim() === '' ? UNKNOWN_NAME : name)
                    }}
                >
                    💾
                </Button> }
            </ButtonGroup>
            <Form.Control
                style={{minWidth: 100}}
                type="text"
                title={name} 
                placeholder="pattern name"
                value={name}
                onChange={(e) => {e.stopPropagation(); setName(e.target.value)}}
                ref={inputRef}
                disabled={!edit}
                autoFocus
            />

        </>
    )

}
