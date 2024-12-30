// import React from 'react';
// import { Nav } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';
// import "../../AppBar.css";
//
// const AppBar = () => {
//   return (
//     <Nav className="justify-content-center bottom-nav">
//       <LinkContainer to="/nearby">
//         <Nav.Link className="nav-item">
//           <i className="icon">📍</i>
//           <span>내 주변 초록불</span>
//         </Nav.Link>
//       </LinkContainer>
//       <LinkContainer to="/challenges">
//         <Nav.Link className="nav-item">
//           <i className="icon">🌿</i>
//           <span>챌린지</span>
//         </Nav.Link>
//       </LinkContainer>
//       <LinkContainer to="/">
//         <Nav.Link className="nav-item active">
//           <div className="active-circle">
//             <i className="icon">🏠</i>
//           </div>
//           <span>홈</span>
//         </Nav.Link>
//       </LinkContainer>
//       <LinkContainer to="/feed">
//         <Nav.Link className="nav-item">
//           <i className="icon">🔲</i>
//           <span>피드</span>
//         </Nav.Link>
//       </LinkContainer>
//       <LinkContainer to="/mypage">
//         <Nav.Link className="nav-item">
//           <i className="icon">👤</i>
//           <span>마이페이지</span>
//         </Nav.Link>
//       </LinkContainer>
//     </Nav>
//   );
// };
//
// export default AppBar;
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppBar = () => {
    return (
        <Nav className="justify-content-center bottom-nav">
            <Nav.Link as={Link} to="/nearby" className="nav-item">
                <i className="icon">📍</i>
                <span>내 주변 초록불</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/challenges" className="nav-item">
                <i className="icon">🌿</i>
                <span>챌린지</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/" className="nav-item active">
                <div className="active-circle">
                    <i className="icon">🏠</i>
                </div>
                <span>홈</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/feed" className="nav-item">
                <i className="icon">🔲</i>
                <span>피드</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/mypage" className="nav-item">
                <i className="icon">👤</i>
                <span>마이페이지</span>
            </Nav.Link>
        </Nav>
    );
};

export default AppBar;
