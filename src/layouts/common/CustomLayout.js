import {Outlet, useLocation} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "../../components/common/NavBar";
import Header from "../../components/common/Header";
import AppBar from "../../components/common/AppBar";

function CustomLayout() {
    // 현재 로케이션 불러오기
    const location = useLocation();

    // 이 경로들에서만 AppBar 표시
    const showAppBar = ['/', '/nearby', '/location', '/challenges', '/feed', '/mypage'].includes(location.pathname);

    return(
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                {/* <Header/> */}
                <Navbar/>
                <Container className="mt-5 flex-grow-1" style={{ maxWidth: "563px", margin: "0 auto", padding: "0 15px" }}>
                    <main>
                        <Outlet/>
                    </main>
                </Container>
                {showAppBar && <AppBar/>}
            </div>
        </>
    );
}

export default CustomLayout;