import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useContext } from "react";
import { FileLoaderComponent } from "./fileloader";
import { IPattern, PatternContext } from "../context";
import { onSave } from "../services/file.service";

function NavbarComponent() {
  const {
    patternState,
    savePattern,
    newPattern,
    showOpenFileDialog,
    setShowOpenFileDialog,
    convertToPng,
  } = useContext(PatternContext);

  const onLoad = (pattern: IPattern) => {
    savePattern(pattern);
    setShowOpenFileDialog(false);
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#">Mosaic Crochet Pattern Generator</Navbar.Brand>
          <Navbar.Toggle aria-controls="menu-navbar-nav" />
          <Navbar.Collapse id="menu-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="File" id="file-nav-dropdown">
                <NavDropdown.Item href="" onClick={() => newPattern()}>
                  New
                </NavDropdown.Item>
                <NavDropdown.Item
                  href=""
                  onClick={() => setShowOpenFileDialog(true)}
                >
                  Load
                </NavDropdown.Item>
                <NavDropdown.Item href="" onClick={() => onSave(patternState)}>
                  Save
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="" onClick={convertToPng}>
                  Export
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showOpenFileDialog && (
        <FileLoaderComponent
          onClose={() => setShowOpenFileDialog(false)}
          onLoad={onLoad}
        />
      )}
    </>
  );
}

export default NavbarComponent;
