import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ExDesign from './pages/ExDesign';
import CustomLayout from './layouts/common/CustomLayout';
import RegistChallenge from './pages/challenge/RegistChallenge';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomLayout />}>
      
      <Route index element={<MainPage />} />
      <Route path="/ex" element={<ExDesign />} />

      {/* challenge */}
      <Route path="/challenge">
        <Route index element={<RegistChallenge />} />
      </Route>

      </Route>
    </Routes>
  );
}

export default App;
