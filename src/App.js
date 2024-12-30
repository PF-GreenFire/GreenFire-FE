import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomLayout from './components/layout/CustomLayout';
import MainPage from './pages/MainPage';
import ExDesign from './pages/ExDesign';
import RegistChallenge from './pages/RegistChallenge';
import AppBar from './components/common/AppBar';
import NearbyMain from './pages/map/NearbyMain';
import ChallengeMain from './pages/challenge/ChallengeMain';
import FeedMain from './pages/feed/FeedMain';
import MyPageMain from './pages/mypage/MypageMain';

const App = () => {
  return (
    <>
      <AppBar />
      <Routes>
        <Route path="/" element={<CustomLayout />}>
          <Route index element={<MainPage />} />
          <Route path="/ex" element={<ExDesign />} />

          {/* AppBar */}
          <Route path="/nearby" element={<NearbyMain />} />
          <Route path="/challenges" element={<ChallengeMain />} />
          <Route path="/feed" element={<FeedMain />} />
          <Route path="/mypage" element={<MyPageMain />} />

          {/* challenge */}
          <Route path="/challenge">
            <Route index element={<RegistChallenge />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
