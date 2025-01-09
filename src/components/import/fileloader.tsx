import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { ChangeEvent, FC, useCallback, useState } from 'react'

interface PROPS {
    onClose: () => void
    onLoad: (file: File | undefined) => void
}

export const ImageFileLoaderComponent: FC<PROPS> = ({ onLoad, onClose }) => {
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
                <Modal.Title>Load Image</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Select image file to load.</p>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={loadFileInput}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => onLoad(file)}>
                    Load
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
