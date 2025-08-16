import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

export default function Waiting() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");

  // 🔹 Check game status immediately when page loads
  useEffect(() => {
    if (!gameId) return;

    const checkGameStarted = async () => {
      try {
        const res = await fetch(`http://localhost:5000/check_game_started?game_id=${gameId}`);
        const data = await res.json();

        if (data.started) {
          navigate(`/game_phone?ids=${gameId}`);
        }
      } catch (err) {
        console.error("Error checking game status:", err);
      }
    };

    checkGameStarted();
  }, [gameId, navigate]);

  // 🔹 Listen for "started" event from backend via socket.io
  useEffect(() => {
    if (!gameId) return;

    const socket = io("http://localhost:5000");

    socket.emit("joinGame", gameId);

    socket.on("started", () => {
      navigate(`/game_phone?ids=${gameId}`);
    });

    return () => {
      socket.off("started");
      socket.disconnect();
    };
  }, [gameId, navigate]);

  return (
    <div className="LoginPage">
      <img src="images/pixalogo.svg" alt="" />
      <div className='towtexts'>
        <h1>התחברת בהצלחה {gameId}</h1>
        <p>אנא המתינו עד שהמשחק יתחיל</p>
      </div>
      <p>
        אם המשחק כבר התחיל ואתם עדיין לא מועברים,
        <br />רעננו את העמוד
      </p>
      <img id='waitinggif' src="images/3dots.gif" alt="Game" />
      <div className='waitingtips'>
        <h1>איך המשחק עובד?</h1>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "10px" }}>
          <p>כתבו פרומפט שמתאר את התמונה שהמורה הציג.</p>
          <img style={{ width: "30px", height: "30px" }} src="https://c8bd7dfa7c70f140c5ca4d02d9f73479.cdn.bubble.io/f1737369966347x206973762762250980/number.svg" alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: "10px" }}>
          <p>ראו מי כתב את הפרומט הכי קרוב !</p>
          <img style={{ width: "30px", height: "30px" }} src="https://c8bd7dfa7c70f140c5ca4d02d9f73479.cdn.bubble.io/f1737369983817x193583793427988260/number%20%281%29.svg" alt="" />
        </div>
      </div>
    </div>
  );
}
