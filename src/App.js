import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ExDesign from './pages/ExDesign';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/ex" element={<ExDesign/>}/>
    </Routes>
  );
}

export default App;
