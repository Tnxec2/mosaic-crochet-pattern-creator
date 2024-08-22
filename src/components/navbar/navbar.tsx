import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useContext } from 'react'
import { FileLoaderComponent } from '../fileload/fileloader'
import { IPattern, PatternContext } from '../../context'
import { onSave } from '../../services/file.service'
import { VERSION } from '../../model/constats'
import { PreviewComponent } from '../export/preview'
import { mug } from '../../sampledata/mug'
import { nya } from '../../sampledata/nya'
import { infinityBorder } from '../../sampledata/infinityborder'

function NavbarComponent() {
    const {
        patternState,
        savePattern,
        newPattern,
        showOpenFileDialog,
        setShowOpenFileDialog,
        showPreviewDialog,
        setShowPreviewDialog,
    } = useContext(PatternContext)

    const onLoad = (pattern: IPattern) => {
        savePattern(pattern)
        setShowOpenFileDialog(false)
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar id="menu-navbar-nav">
                        <Navbar.Brand href="#">
                            Mosaic Crochet Pattern Generator
                        </Navbar.Brand>
                        <Nav className="me-auto ms-0">
                            <NavDropdown title="File" id="file-nav-dropdown">
                                <NavDropdown.Item
                                    href=""
                                    onClick={() => newPattern()}
                                >
                                    New
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href=""
                                    onClick={() => setShowOpenFileDialog(true)}
                                >
                                    Load
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href=""
                                    onClick={() => onSave(patternState)}
                                >
                                    Save
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    href=""
                                    onClick={() => setShowPreviewDialog(true)}
                                >
                                    Export Image
                                </NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Samples" id="samples-nav-dropdown">
                                <NavDropdown.Header>
                                    Caution! Your changes
                                    <br/>
                                    will be overwritten
                                </NavDropdown.Header>
                                <NavDropdown.Item
                                    href=""
                                    onClick={() => savePattern(mug)}
                                >
                                    Mug
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href=""
                                    onClick={() => savePattern(nya)}
                                >
                                    Nya
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href=""
                                    onClick={() => savePattern(infinityBorder)}
                                >
                                    Infinity border
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar>
                    <Navbar id="menu-navbar-version">
                        <Navbar.Text className="justify-content-end ms-3">
                            v. {VERSION}
                        </Navbar.Text>
                    </Navbar>
                </Container>
            </Navbar>

            {showOpenFileDialog && (
                <FileLoaderComponent
                    onClose={() => setShowOpenFileDialog(false)}
                    onLoad={onLoad}
                />
            )}

            {showPreviewDialog && (
                <PreviewComponent
                    onClose={() => setShowPreviewDialog(false)}
                />
            )}
        </>
    )
}

export default NavbarComponent
