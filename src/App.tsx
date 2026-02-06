import NavbarComponent from './components/navbar/navbar'
import { PanelComponent } from './components/panel/panel'

import { Col, Row } from 'react-bootstrap'
import { useStore } from './context'
import { PatternWithCanvasComponent } from './components/patternCanvas/pattern'
import { PatternWindowedWithCanvasComponent } from './components/patternCanvas/patternWindowed'

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
                    <PatternWindowedWithCanvasComponent />
                    :
                    // <PatternComponent />
                    <PatternWithCanvasComponent />
                }
                </Col>
            </Row>
            </div>
    )
}

export default App
