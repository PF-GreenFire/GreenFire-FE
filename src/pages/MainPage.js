import { Container, Card } from "react-bootstrap";
import StoreInfoCard from "../components/item/card/StoreInfoCard"; // 경로 확인
import { useNavigate } from 'react-router-dom';
import Banner from "../components/common/Banner";
import HighlightedText from "../components/item/title/HighlightedTitle";
import Challenge from "../components/main/Challenge";
import Feed from "../components/main/Feed";
import LocationMap from "./map/LocationMap";

const MainPage = () => {
    const navigate = useNavigate();

    const stores = [
        {
            name: "초록밥",
            location: "서울시 강남구",
            memo: "서울시 강남구",
            storeCode: "001",
            imageUrl: "/store_ex1.png"
        },
        {
            name: "채식당",
            location: "서울시 종로구",
            memo: "서울시 종로구",
            storeCode: "002",
            imageUrl: "/store_ex1.png"
        },
        {
            name: "쌈밥집",
            location: "서울시 영등포구",
            memo: "서울시 영등포구",
            storeCode: "003",
            imageUrl: "/store_ex1.png"
        }
    ];

    return (
        <>
            <div style={{ marginTop: "-30px" }}>
                <Banner />
            </div>

            <Container style={{ marginBottom: "120px", padding: "0 15px" }}>
                {/* 인기 장소 */}
                <div className="mt-5" style={{ maxWidth: "563px", margin: "0 auto" }}>
                    <HighlightedText
                        mainText="인기장소"
                        subText="이번 달 가장 방문이 많았던 장소"
                    />

                    <div className="d-flex gap-3 overflow-auto pb-3">
                        {stores.map((store, index) => (
                            <StoreInfoCard
                                key={index}
                                store={store}
                                imageUrl={store.imageUrl}
                            />
                        ))}
                    </div>
                </div>

                {/* 내 주변 초록불 */}
                <div className="mt-5 mb-5" style={{ maxWidth: "563px", margin: "40px auto" }}>
                    <HighlightedText
                        mainText="내 주변 초록불"
                        subText="근처의 환경 지킴이들을 찾아보세요."
                    />

                    <LocationMap />
                </div>

                {/* 챌린지 - 마감임박 */}
                <div style={{ maxWidth: "563px", margin: "40px auto" }}>
                    <Challenge />
                </div>

                {/* 지금 초록불은 */}
                <div style={{ maxWidth: "563px", margin: "40px auto" }}>
                    <Feed />
                </div>
            </Container>
        </>
    )
}

export default MainPage;