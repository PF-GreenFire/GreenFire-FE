import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import HighlightedTitle from "../components/item/title/HighlightedTitle";
import StoreInfoCard from "../components/item/card/StoreInfoCard";
import { useNavigate } from 'react-router-dom';
import { FaCartPlus, FaRegHeart } from 'react-icons/fa';

const MainPage = () => {

    const navigate = useNavigate();

    const store = {
        name: "테스트 가게",
        location: "서울시 강남구",
        memo: "테스트용 가게입니다.",
        storeCode: "001"
    };
    const imageUrl = "https://images.unsplash.com/photo-1612834966073-1a7d4b2f8a3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjA0NzN8MHwxfGFsbHwxf"

    return (
        <>
            <Container style={{ marginBottom: "100px" }}>
                {/* 슬라이드 배너 */}

                {/* 인기 장소 */}
                <HighlightedTitle
                    mainText="인기 장소" 
                    subText="최근 가장 방문이 많은 장소" 
                />
                <StoreInfoCard store={store} imageUrl={imageUrl} />

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
                        <Col xs={6} md={4}>
                            <Image src="" roundedCircle />
                        </Col>
                        <Col xs={6} md={4}>
                            <Image src="" roundedCircle />
                        </Col>
                        <Col xs={6} md={4}>
                            <Image src="" roundedCircle />
                        </Col>
                        <Col xs={6} md={4}>
                            <Image src="" roundedCircle />
                        </Col>
                        <Col xs={6} md={4}>
                            <Image src="" roundedCircle />
                        </Col>
                        <Col xs={6} md={4}>
                            <Image src="" roundedCircle />
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