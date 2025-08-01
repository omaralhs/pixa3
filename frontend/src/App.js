import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewIndex from './Pages/NewIndex';
import Game from './Pages/Game';
import GamePhone from './Pages/GamePhone';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewIndex />}></Route>
        <Route path="/game" element={<Game />}></Route>
        <Route path="/game_phone" element={<GamePhone />}></Route>

      </Routes>
    </Router>

  );
}

export default App;
