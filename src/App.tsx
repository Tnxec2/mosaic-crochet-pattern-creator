import NavbarComponent from './components/navbar/navbar'
import { PanelComponent } from './components/panel/panel'
import { PatternComponent } from './components/pattern/pattern'
import { PatternWindowComponent } from './components/pattern/windowed/pattern'

import { Col, Row } from 'react-bootstrap'
import { useStore } from './context'

function App() {
    const isPatternWindowed = useStore().isPatternWindowed

    return (<>
            <NavbarComponent />
            <Row className="m-3">
                <Col sm={2}>
                    <PanelComponent />
                </Col>
                <Col sm={10}>
                { isPatternWindowed ?
                    <PatternWindowComponent />
                    :
                    <PatternComponent />
                }
                </Col>
            </Row>
            </>
    )
}

export default App
