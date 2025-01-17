import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { ChangeEvent, FC, useCallback, useState } from 'react'
import { IPattern } from '../../context'
import { loadJsonFile } from '../../services/file.service'

interface PROPS {
    onClose: () => void
    onLoad: (pattern: IPattern) => void
}

export const FileLoaderComponent: FC<PROPS> = ({ onLoad, onClose }) => {
    const [file, setFile] = useState<File>()

    const loadFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.item(0)
        if (file) {
            setFile(file)
        }
    }, [])

    return (
        <Modal show={true}>
            <Modal.Header closeButton onHide={onClose}>
                <Modal.Title>Load Pattern</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Select pattern json file to load.</p>
                <Form.Control
                    type="file"
                    accept="application/json"
                    onChange={loadFileInput}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => loadJsonFile(file, onLoad)}>
                    Load
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
