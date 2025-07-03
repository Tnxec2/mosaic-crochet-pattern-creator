import NavbarComponent from './components/navbar/navbar'
import { PanelComponent } from './components/panel/panel'
import { PatternComponent } from './components/pattern/pattern'
import { PatternWindowedComponent } from './components/pattern/windowed/pattern'

import { Col, Row } from 'react-bootstrap'
import { useStore } from './context'

function App() {
    const isPatternWindowed = useStore().isPatternWindowed

    return (<div className='overflow-hidden' style={{ height: '100vh' }}>
            <NavbarComponent />
            <Row className="m-0 mt-2"  style={{maxHeight: '90vh'}}>
                <Col sm={2} style={{ maxHeight: '90vh', overflowY: 'scroll' }}>
                    <PanelComponent />
                </Col>
                <Col sm={10} style={{ maxHeight: '90vh', overflowY: 'scroll' }}>
                { isPatternWindowed ?
                    <PatternWindowedComponent />
                    :
                    <PatternComponent />
                }
                </Col>
            </Row>
            </div>
    )
}

export default App
