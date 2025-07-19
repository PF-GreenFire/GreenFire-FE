import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ExDesign from './pages/ExDesign';
import NearbyMain from './pages/map/NearbyMain';
import ChallengeMain from './pages/challenge/ChallengeMain';
import FeedMain from './pages/feed/FeedMain';
import MyPageMain from './pages/mypage/MypageMain';
import CustomLayout from './layouts/common/CustomLayout';
import RegistChallenge from './pages/challenge/RegistChallenge';
import ChallengeDetail from './pages/challenge/ChallengeDetail';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<CustomLayout />}>
          <Route index element={<MainPage />} />
          <Route path="ex" element={<ExDesign />} />

          {/* AppBar */}
          <Route path="nearby" element={<NearbyMain />} />
          <Route path="challenges" element={<ChallengeMain />} />
          <Route path="challenges/:id" element={<ChallengeDetail />} />
          <Route path="feed" element={<FeedMain />} />
          <Route path="mypage" element={<MyPageMain />} />

          {/* challenge */}
          <Route path="challenge" element={<RegistChallenge />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
