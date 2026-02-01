import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from '../config';

export default function ScoreBoard() {
  const [images, setImages] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");

  React.useEffect(() => {
    async function fetchPlayers() {
      try {
      const res = await fetch(`${API_URL}/gettopplayers/${gameId}`);
        const data = await res.json();

        let players = data.players || [];

        // Fill with dummy players if less than 3
        while (players.length < 3) {
          players.push({
            firstname: 'Guest',
            final_score: 0,
            avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${players.length + 1}`
          });
        }

        setUsers(players.slice(0, 3)); // Only top 3
      } catch (err) {
        console.error("Failed to fetch players:", err);
      }
    }

    if (gameId) {
      fetchPlayers();
    }
  }, [gameId]);

  function goToHome() {
    navigate('/');
  }
 React.useEffect(() => {
  async function fetchPlayers() {
    try {
      const res = await fetch(`${API_URL}/gettopplayers/${gameId}`);
      const data = await res.json();

      setUsers(data.players || []);
      // ✅ Extract avatars from the players list
      const avatars = (data.players || []).map(p => p.avatar);

      // Fallback: if not enough avatars, fill with Dicebear
      while (avatars.length < 3) {
        avatars.push(`https://api.dicebear.com/9.x/bottts/svg?seed=${avatars.length + 1}`);
      }

      setImages(avatars);
    } catch (err) {
      console.error("Failed to fetch players:", err);
    }
  }

  if (gameId) {
    fetchPlayers();
  }
}, [gameId]);

  return (
    <div className="scoreboard-page">
      <img className="img1" src="images/fireworks2.svg" alt="fire" />
      <img className="img2" src="images/fireworks.svg" alt="fire" />
      <button onClick={goToHome} className='exitbutt'>יציאה</button>

      <div className="scoreboard-content">
        <div className="lines">
          {/* 🥈 2nd place on left */}
          <div className="line1">
            <img className='userimg' src={users[1]?.avatar} alt="2nd place" />
            <div className="bubble">
              <h2>{users[1]?.firstname}</h2>
              <p>{users[1]?.final_score} points</p>
            </div>
            <img className="block" src="images/topline1.svg" alt="" />
            <div className="backgroundline1">
              <img className="imgnumber" src="images/number2.svg" alt="2nd place" />
            </div>
          </div>

          {/* 🥇 1st place in center */}
          <div className="line1">
            <img className='userimg' src={users[0]?.avatar} alt="1st place" />
            <div className="bubble">
              <h2>{users[0]?.firstname}</h2>
              <p>{users[0]?.final_score} points</p>
            </div>
            <img className="block" src="images/topline1.svg" alt="" />
            <div className="backgroundline2">
              <img className="imgnumber" src="images/number1.svg" alt="1st place" />
            </div>
          </div>

          {/* 🥉 3rd place on right */}
          <div className="line1">
            <img className='userimg' src={users[2]?.avatar} alt="3rd place" />
            <div className="bubble">
              <h2>{users[2]?.firstname}</h2>
              <p>{users[2]?.final_score} points</p>
            </div>
            <img className="block" src="images/topline2.svg" alt="" />
            <div className="backgroundline3">
              <img className="imgnumber" src="images/number3.svg" alt="3rd place" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
