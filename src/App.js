import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import FindEmailPage from './pages/auth/FindEmailPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DeleteAccountPage from './pages/auth/DeleteAccountPage';
import NoticeList from './pages/notice/NoticeList'
import NoticeDetail from './pages/notice/NoticeDetail'
import NoticeForm from './pages/notice/NoticeForm';
import AdminPageLayout from './layouts/AdminPageLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNoticeList from './pages/admin/AdminNoticeList';
import AdminMemberList from './pages/admin/AdminMemberList';
import AdminReportList from './pages/admin/AdminReportList';
import ProtectedRoute from './components/common/ProtectedRoute';
import SessionExpiredModal from './components/common/SessionExpiredModal';
import MypageLayout from "./layouts/MypageLayout";
import MypageMain from "./pages/mypage/MypageMain";
import MypageScrapbookMain from "./pages/mypage/ScrapbookMain";
import MypageAchievementMain from "./pages/mypage/AchievementMain";
import MypageChallengeMain from "./pages/mypage/ChallengeMain";
import MypageEchoMemoryMain from "./pages/mypage/EchoMemoryMain";
import MypageInfo from "./pages/mypage/MypageInfo";
import MypageWithdrawal from "./pages/mypage/MypageWithdrawal";
import LocationMain from "./pages/location/LocationMain";
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
        <Route path="/find-email" element={<FindEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/account/delete" element={
          <ProtectedRoute>
            <DeleteAccountPage />
          </ProtectedRoute>
        } />

        {/* notice pages */}
        <Route path="/notices" element={<NoticeList />} />
        <Route path="/notices/new" element={
          <ProtectedRoute requiredRole="ADMIN">
            <NoticeForm mode="create" />
          </ProtectedRoute>
        } />
        <Route path="/notices/:noticeCode" element={<NoticeDetail />} />
        <Route path="/notices/:noticeCode/edit" element={
          <ProtectedRoute requiredRole="ADMIN">
            <NoticeForm mode="edit" />
          </ProtectedRoute>
        } />

        {/* admin pages */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminPageLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="notices" element={<AdminNoticeList />} />
          <Route path="members" element={<AdminMemberList />} />
          <Route path="reports" element={<AdminReportList />} />
        </Route>

        <Route path="/" element={<CustomLayout />}>
          <Route index element={<MainPage />} />
          <Route path="ex" element={<ExDesign />} />

          {/* AppBar */}
          <Route path="nearby" element={<NearbyMain />} />
          <Route path="location" element={<LocationMain />} />
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

        {/* Mypage 전용 Layout */}
        <Route path="mypage" element={<MypageLayout />}>
          {/* Mypage */}
          <Route index element={<MypageMain />} />
          <Route path="scrapbook" element={<MypageScrapbookMain />} />
          <Route path="achievements" element={<MypageAchievementMain />} />
          <Route path="challenges" element={<MypageChallengeMain />} />
          <Route path="eco-memories" element={<MypageEchoMemoryMain />} />
          <Route path="info" element={<MypageInfo />} />
          <Route path="withdrawal" element={<MypageWithdrawal />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
