import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { ChangeEvent, FC, useCallback, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

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
        <Container>
            <Row>
                <Col>
                <Card className='m-3'>
                <Card.Header>
                    <Card.Title>Load Image</Card.Title>
                </Card.Header>

                <Card.Body>
                    <p>Select image file to load.</p>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={loadFileInput}
                    />
                </Card.Body>

                <Card.Footer className='d-flex justify-content-between'>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => onLoad(file)}>
                        Load
                    </Button>
                </Card.Footer>
                </Card>
                </Col>
            </Row>
        </Container>
    )
}
