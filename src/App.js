import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ExDesign from "./pages/ExDesign";
import NearbyMain from "./pages/map/NearbyMain";
import ChallengeMain from "./pages/challenge/ChallengeMain";
import FeedMain from "./pages/feed/FeedMain";
import CustomLayout from "./layouts/common/CustomLayout";
import RegistChallenge from "./pages/challenge/RegistChallenge";
import ChallengeDetail from "./pages/challenge/ChallengeDetail";
import MypageLayout from "./layouts/MypageLayout";
import MypageMain from "./pages/mypage/MypageMain";
import MypageScrapbookMain from "./pages/mypage/ScrapbookMain";
import MypageAchievementMain from "./pages/mypage/AchievementMain";
import MypageChallengeMain from "./pages/mypage/ChallengeMain";
import MypageEchoMemoryMain from "./pages/mypage/EchoMemoryMain";
import LocationMain from "./pages/location/LocationMain";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<CustomLayout />}>
          <Route index element={<MainPage />} />
          <Route path="ex" element={<ExDesign />} />

          {/* AppBar */}
          <Route path="nearby" element={<NearbyMain />} />
          <Route path="location" element={<LocationMain />} />
          <Route path="challenges" element={<ChallengeMain />} />
          <Route path="challenges/:id" element={<ChallengeDetail />} />
          <Route path="feed" element={<FeedMain />} />

          {/* challenge */}
          <Route path="challenge" element={<RegistChallenge />} />
        </Route>

        {/* Mypage 전용 Layout */}
        <Route path="mypage" element={<MypageLayout />}>
          {/* Mypage */}
          <Route index element={<MypageMain />} />
          <Route path="scrapbook" element={<MypageScrapbookMain />} />
          <Route path="achievements" element={<MypageAchievementMain />} />
          <Route path="challenges" element={<MypageChallengeMain />} />
          <Route path="eco-memories" element={<MypageEchoMemoryMain />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
