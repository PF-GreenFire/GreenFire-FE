import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Footer() {
    return (
        <footer>
            <Container fluid className="bg-white text-dark mt-5 p-4 text-center">
                <Row className="border-top border-1 border-dark pt-5">
                    <Col md="4" className="border-end border-1 border-dark text-start pt-3 px-5">
                        <div>
                            <div className="fs-4 fw-medium">
                                <Image src="/greenFire_logo-nav.png"
                                       className="p-2 mb-1" width={45} height={45}/>
                                고객 센터
                            </div>
                            <div className="fs-6 fw-light">
                                1588-1588 &nbsp;&nbsp; 09:00 ~ 18:00
                            </div>
                            <Row className="pt-3">
                                <Col md="3" className="px-0 d-flex align-items-center justify-content-center">
                                    <Button className="outline-secondary border-secondary-subtle text-center">
                                        버튼
                                    </Button>
                                </Col>
                                <Col md="9">
                                    고객센터 운영시간에<br/>
                                    순차적으로 답변드리겠습니다.
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <Col md="8" className="text-start px-5">
                        <Navbar data-bs-theme="light" className="">
                            <Container>
                                <Nav className="me-auto w-100 justify-content-around">
                                    <Nav.Link href="#">초록불소개</Nav.Link>
                                    <Nav.Link href="#">이용약관</Nav.Link>
                                    <Nav.Link href="#">인재채용</Nav.Link>
                                    <Nav.Link href="#">개인정보처리방침</Nav.Link>
                                    <Nav.Link href="#">이용안내</Nav.Link>
                                </Nav>
                            </Container>
                        </Navbar>

                        <div className="mt-3 text-body-tertiary mx-5" style={{letterSpacing: '0.1em'}}>
                            법인명 (상호) : 주식회사 초록불
                            <span> | </span>
                            사업자등록번호 : 123-45-67897
                            {/*<a href="#">사업자정보 확인</a>*/}
                            <br/>
                            통신판매업 : 제 2024-서울종로-01234 호<br/>
                            주소 : 서울특별시 종로구 인사동길 12, 15층 11 강의실 앞
                            <span> | </span>
                            대표이사 : 여은파
                        </div>

                        <div className="mx-5 pt-4">
                            &copy; {new Date().getFullYear()} YEP ALL RIGHTS RESERVED.
                        </div>
                    </Col>
                </Row>

            </Container>
        </footer>
    );
}

export default Footer;