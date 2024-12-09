import {Outlet} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "../../components/common/NavBar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

function CustomLayout() {

    return(
        <>
            <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <Header/>
            <Navbar/>
            <Container className="mt-5 flex-grow-1">
                <main>
                    <Outlet/>
                </main>
            </Container>
            <Footer/>
        </div>
        </>
    );

}

export default CustomLayout;