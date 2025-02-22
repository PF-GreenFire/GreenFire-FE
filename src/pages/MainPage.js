import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import HighlightedTitle from "../components/item/title/HighlightedTitle";
import StoreInfoCard from "../components/item/card/StoreInfoCard";
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { FaCartPlus, FaRegHeart } from 'react-icons/fa';

const MainPage = () => {

    const navigate = useNavigate();

    const store = {
        name: "테스트 가게",
        location: "서울시 강남구",
        memo: "테스트용 가게입니다.",
        storeCode: "001"
    };
    const imageUrl = "store_ex1.png"

    return (
        <>
            <Container style={{ marginBottom: "100px" }}>
                {/* 슬라이드 배너 */}
                <Carousel>
                    <Carousel.Item>
                        <Image
                            src="ex1.png"
                            text="First slide"
                            fluid
                            className="d-block w-100" />
                        {/* <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image
                            src="ex1.png"
                            text="First slide"
                            fluid
                            className="d-block w-100" />
                        {/* <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption> */}
                    </Carousel.Item>
                </Carousel>

                {/* 인기 장소 */}
                <HighlightedTitle
                    mainText="인기 장소"
                    subText="최근 가장 방문이 많은 장소"
                />
                <Row className="d-flex gap-2">
                    <StoreInfoCard store={store} imageUrl={imageUrl} />
                    <StoreInfoCard store={store} imageUrl={imageUrl} />
                    <StoreInfoCard store={store} imageUrl={imageUrl} />
                </Row>

                {/* 내 주변 초록불 */}
                <HighlightedTitle
                    mainText="내 주변 초록불"
                    subText="근처의 환경 지킴이들을 찾아보세요."
                />

                {/* 챌린지 - 마감임박 */}
                <HighlightedTitle
                    mainText="챌린지"
                    subText="모집 마감 임박! 서둘러 신청해주세요."
                />
                <Container>
                    <Row>
                        <Col xs={6} md={2} className="text-center">
                        <Image src="Frame 299.png" roundedCircle />
                        <p className="mt-2">플로깅</p>
                        </Col>
                        <Col xs={6} md={2} className="text-center">
                        <Image src="Frame 300.png" roundedCircle />
                        <p className="mt-2">비건식</p>
                        </Col>
                        <Col xs={6} md={2} className="text-center">
                        <Image src="Frame 301.png" roundedCircle />
                        <p className="mt-2">제로웨이스트</p>
                        </Col>
                        <Col xs={6} md={2} className="text-center">
                        <Image src="Frame 302.png" roundedCircle />
                        <p className="mt-2">동물보호</p>
                        </Col>
                        <Col xs={6} md={2} className="text-center">
                        <Image src="Frame 303.png" roundedCircle />
                        <p className="mt-2">독서모임</p>
                        </Col>
                        <Col xs={6} md={2} className="text-center">
                        <Image src="Frame 304.png" roundedCircle />
                        <p className="mt-2">봉사</p>
                        </Col>
                    </Row>
                    </Container>
                {/* 지금 초록불은 */}
                <HighlightedTitle
                    mainText="지금 초록불은"
                    subText=""
                />

            </Container>
        </>
    )
}

export default MainPage;