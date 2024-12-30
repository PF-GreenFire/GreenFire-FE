import {Outlet} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "../common/NavBar";
import Header from "../common/Header";
import Footer from "../common/Footer";
import AppBar from "../common/AppBar";

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
            <AppBar/>
        </div>
        </>
    );

}

export default CustomLayout;