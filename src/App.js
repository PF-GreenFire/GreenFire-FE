import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ExDesign from './pages/ExDesign';
import NearbyMain from './pages/map/NearbyMain';
import ChallengeMain from './pages/challenge/ChallengeMain';
import FeedMain from './pages/feed/FeedMain';
import CustomLayout from './layouts/common/CustomLayout';
import RegistChallenge from './pages/challenge/RegistChallenge';
import ChallengeDetail from './pages/challenge/ChallengeDetail';
import MyPageMain from "./pages/mypage/MypageMain";
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

          {/* Mypage */}
          <Route path="mypage" element={<MyPageMain />} />
          <Route path="mypage/scrapbook" element={<MypageScrapbookMain />} />
          <Route path="mypage/achievements" element={<MypageAchievementMain />} />
          <Route path="mypage/challenges" element={<MypageChallengeMain />} />
          <Route path="mypage/eco-memories" element={<MypageEchoMemoryMain />} />

          {/* challenge */}
          <Route path="challenge" element={<RegistChallenge />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
