import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleNavigation = (path) => {
        navigate(path);
        handleClose();  // 사이드바 닫기
    };

    return (
        <Navbar expand="lg" className="bg-success p-4" style={{ height: 100 }}>
            <Container fluid>
                <Navbar.Brand href="/" className="text-white fw-bold mx-3" style={{ fontSize: "1.5rem" }}>
                    GREEN FIRE
                </Navbar.Brand>
                <IoMdMenu 
                    onClick={handleShow} 
                    style={{ width: "35px", height: "35px", color: "white", cursor: "pointer" }} 
                />
                <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-light">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="fw-bold text-dark">메뉴</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="flex-column">
                            <Nav.Link 
                                onClick={() => handleNavigation('/cs')}
                                className="text-dark fw-medium py-2 px-3 border-bottom"
                                style={{ cursor: "pointer" }}
                            >
                                CS
                            </Nav.Link>
                            <Nav.Link 
                                onClick={() => handleNavigation('/main')}
                                className="text-dark fw-medium py-2 px-3 border-bottom"
                                style={{ cursor: "pointer" }}
                            >
                                공지사항
                            </Nav.Link>
                            <Nav.Link 
                                onClick={() => handleNavigation('/about')}
                                className="text-dark fw-medium py-2 px-3 border-bottom"
                                style={{ cursor: "pointer" }}
                            >
                                About
                            </Nav.Link>
                            <Nav.Link 
                                onClick={() => handleNavigation('/settings')}
                                className="text-dark fw-medium py-2 px-3 border-bottom"
                                style={{ cursor: "pointer" }}
                            >
                                설정
                            </Nav.Link>
                            <Nav.Link 
                                onClick={() => handleNavigation('/profile')}
                                className="text-dark fw-medium py-2 px-3 border-bottom"
                                style={{ cursor: "pointer" }}
                            >
                                나의 정보
                            </Nav.Link>
                            <Nav.Link 
                                onClick={() => handleNavigation('/logout')}
                                className="text-danger fw-medium py-2 px-3 border-bottom"
                                style={{ cursor: "pointer" }}
                            >
                                로그아웃
                            </Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Offcanvas>
            </Container>
        </Navbar>
    );
}

export default NavBar;
