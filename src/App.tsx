import NavbarComponent from './components/navbar'
import { PanelComponent } from './components/panel'
import { PatternComponent } from './components/pattern'
import { PatternContextProvider } from './context'
import { Col, Row } from 'react-bootstrap'

function App() {
    return (
        <PatternContextProvider>
            <NavbarComponent />
            <Row className="m-3">
                <Col sm={2}>
                    <PanelComponent />
                </Col>
                <Col sm={10}>
                    <PatternComponent />
                </Col>
            </Row>
        </PatternContextProvider>
    )
}

export default App
