import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewIndex from './Pages/NewIndex';
import Game from './Pages/Game';
import GamePhone from './Pages/GamePhone';
import TeacherTips from './Pages/teacherTips';
import Choose2images from './Pages/Choose2images';
import QrCode from './Pages/QrCode';
import StudentTips from './Pages/StudentTips';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewIndex />}></Route>
        <Route path="/game" element={<Game />}></Route>
        <Route path="/game_phone" element={<GamePhone />}></Route>
        <Route path="/teacher_tips" element={<TeacherTips />}></Route>
        <Route path="/choose2images" element={<Choose2images />}></Route>
        <Route path="/qr_code" element={<QrCode />}></Route>
        <Route path="/student_tips" element={<StudentTips />}></Route>
      </Routes>
    </Router>

  );
}

export default App;
