import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import LoginPopup from "../../pages/auth/LoginPopup";

function MypageNavbar() {
  const [show, setShow] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogin = () => {
    setShowLoginPopup(true);
    handleClose();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleClose();
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          position: "relative",
        }}
      >
        <Container style={{ maxWidth: "600px" }}>
          <div className="d-flex justify-content-between align-items-center py-2">
            <div>
              <h5
                className="fw-bold text-success mb-0"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                GREEN FIRE
              </h5>
            </div>
            <div className="d-flex">
              <Button
                variant="link"
                className="text-success p-1"
                onClick={handleShow}
              >
                <IoMdMenu size={25} />
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Offcanvas Sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="bg-light"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold text-dark">메뉴</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {!isLoggedIn ? (
              <Nav.Link
                onClick={handleLogin}
                className="text-success fw-bold py-2 px-3 border-bottom"
                style={{ cursor: "pointer" }}
              >
                로그인
              </Nav.Link>
            ) : (
              <>
                <Nav.Link
                  onClick={() => handleNavigation("/profile")}
                  className="text-dark fw-medium py-2 px-3 border-bottom"
                  style={{ cursor: "pointer" }}
                >
                  나의 정보
                </Nav.Link>
                <Nav.Link
                  onClick={handleLogout}
                  className="text-danger fw-medium py-2 px-3 border-bottom"
                  style={{ cursor: "pointer" }}
                >
                  로그아웃
                </Nav.Link>
              </>
            )}
            <Nav.Link
              onClick={() => handleNavigation("/cs")}
              className="text-dark fw-medium py-2 px-3 border-bottom"
              style={{ cursor: "pointer" }}
            >
              CS
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("/main")}
              className="text-dark fw-medium py-2 px-3 border-bottom"
              style={{ cursor: "pointer" }}
            >
              공지사항
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("/about")}
              className="text-dark fw-medium py-2 px-3 border-bottom"
              style={{ cursor: "pointer" }}
            >
              About
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("/settings")}
              className="text-dark fw-medium py-2 px-3 border-bottom"
              style={{ cursor: "pointer" }}
            >
              설정
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Login Popup */}
      <LoginPopup
        show={showLoginPopup}
        onHide={() => setShowLoginPopup(false)}
      />
    </>
  );
}

export default MypageNavbar;
