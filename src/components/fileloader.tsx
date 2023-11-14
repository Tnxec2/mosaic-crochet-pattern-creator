import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ChangeEvent, FC, useState } from 'react';
import { IPattern } from '../context';
import { loadFile } from '../services/file.service';

interface PROPS {
    onClose: () => void
    onLoad: (pattern: IPattern) => void
}

export const FileLoaderComponent: FC<PROPS> = ({onLoad, onClose}) => {
    const[file, setFile] = useState<File>()
    
    const loadFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.item(0);
        if (file) {
          setFile(file)
        }
    }

    const load = () => {
        loadFile(file, onLoad )
    }

    return (

      <Modal show={true}>
        <Modal.Header closeButton>
          <Modal.Title>Load file</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Select file to load.</p>
          <Form.Control type="file" size="sm" accept="application/json" onChange={loadFileInput} />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={load}>Load</Button>
        </Modal.Footer>
      </Modal>

    )

}