import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import Offcanvas from 'react-bootstrap/Offcanvas';

function NavBar() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
 
    return (
        <Navbar expand="lg" className="bg-success p-5" style={{ height: 120 }}>
            <Container fluid>
                <Navbar.Brand href="/" className="text-white mx-3">GREEN FIRE</Navbar.Brand>
                <IoMdMenu onClick={handleShow} style={{width: "30px", height: "30px", color: "white"}}/>
                <Offcanvas show={show} onHide={handleClose} placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        Content here
                    </Offcanvas.Body>
                </Offcanvas>
            </Container>
        </Navbar>
    );
 }
 
 export default NavBar;