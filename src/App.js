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
import SignupPage from './pages/auth/SignupPage';
import DeleteAccountPage from './pages/auth/DeleteAccountPage';
import NoticeList from './pages/notice/NoticeList'
import NoticeDetail from './pages/notice/NoticeDetail'
import NoticeForm from './pages/notice/NoticeForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import SessionExpiredModal from './components/common/SessionExpiredModal';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isSessionExpired, onLoginSuccess, clearSessionExpired } = useAuth();

  return (
    <>
      <SessionExpiredModal
        show={isSessionExpired}
        onLoginSuccess={onLoginSuccess}
        onClose={clearSessionExpired}
      />

      <Routes>
         {/* auth pages */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/account/delete" element={
          <ProtectedRoute>
            <DeleteAccountPage />
          </ProtectedRoute>
        } />

        {/* notice pages */}
        <Route path="/notices" element={<NoticeList />} />
        <Route path="/notices/new" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <NoticeForm mode="create" />
          </ProtectedRoute>
        } />
        <Route path="/notices/:noticeCode" element={<NoticeDetail />} />
        <Route path="/notices/:noticeCode/edit" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <NoticeForm mode="edit" />
          </ProtectedRoute>
        } />

        <Route path="/" element={<CustomLayout />}>
          <Route index element={<MainPage />} />
          <Route path="ex" element={<ExDesign />} />

          {/* AppBar */}
          <Route path="nearby" element={<NearbyMain />} />
          <Route path="challenges" element={<ChallengeMain />} />
          <Route path="challenges/:id" element={<ChallengeDetail />} />
          <Route path="feed" element={<FeedMain />} />
          <Route path="mypage" element={
            <ProtectedRoute>
              <MyPageMain />
            </ProtectedRoute>
          } />

          {/* challenge */}
          <Route path="challenge" element={
            <ProtectedRoute>
              <RegistChallenge />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
