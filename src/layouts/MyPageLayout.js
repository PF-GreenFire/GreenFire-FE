import { Outlet, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import AppBar from "../components/common/AppBar";
import MypageNavbar from "../components/mypage/MypageNavbar";

function MypageLayout() {
  // 현재 로케이션 불러오기
  const location = useLocation();

  // /mypage 경로에서만 AppBar 표시 (하위 경로 제외)
  const showAppBar =
    ["/mypage"].includes(location.pathname) ||
    location.pathname.startsWith("/mypage/");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <MypageNavbar />
      <Container
        className="mt-3 flex-grow-1"
        style={{
          maxWidth: "563px",
          margin: "0 auto",
          padding: "0 15px",
        }}
      >
        <main>
          <Outlet />
        </main>
      </Container>
      {showAppBar && <AppBar />}
    </div>
  );
}

export default MypageLayout;
