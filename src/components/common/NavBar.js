import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import { FaSearch } from 'react-icons/fa';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { Button, Form, InputGroup } from 'react-bootstrap';
// public 폴더에서 이미지 로드

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
        <>
            {/* 전체 배경 div */}
            <div style={{
                backgroundColor: "#ffffff",
                width: "100%",
                position: "relative",
                height: "124px"
            }}>
                <Container style={{ maxWidth: "600px" }}>
                    {/* Header with logo and icons */}
                    <div className="d-flex justify-content-between align-items-center py-2">
                        <div>
                            {/* <img src="/mainlogo.png" alt="GREEN FIRE" width="180" height="30" /> */}
                            <h5 className="fw-bold text-success">GREEN FIRE</h5>
                        </div>
                        <div className="d-flex">
                            <Button variant="link" className="text-success p-1">
                                <FaSearch size={20} />
                            </Button>
                            <Button variant="link" className="text-success p-1" onClick={handleShow}>
                                <IoMdMenu size={25} />
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="pt-1 pb-2">
                        <InputGroup>
                            <Form.Control
                                placeholder="[공지사항] 10월 30일 환경 플로깅 우수자 선 발표"
                                aria-label="Search"
                                style={{ height: "41px" }}
                            />
                            <Button variant="success" style={{ height: "41px" }}>
                                확인하기
                            </Button>
                        </InputGroup>
                    </div>
                </Container>
            </div>

            {/* Offcanvas Sidebar */}
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
        </>
    );
}

export default NavBar;