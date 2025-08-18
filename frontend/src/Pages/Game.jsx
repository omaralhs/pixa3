import React, { useState, useEffect } from 'react';
import '../App.css';
import '../Game.css';
import GetSubs from '../hooks/GetSubs';
import Sub from '../components/Sub';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Game() {
  const [subs, setSubs] = useState([]);
  const [searchParams] = useSearchParams();
  const gameID = searchParams.get('ids'); // Get ids from URL params

  useEffect(() => {
    const socket = io("http://localhost:5000"); // <-- your backend

    socket.emit("waiting_for_subs", gameID);

    // Listen for updates from backend
    socket.on("subs_updated", async () => {
      const result = await GetSubs(gameID);
      setSubs(result);
    });

    return () => {
      socket.disconnect();
    };
  }, [gameID]);

  // Initial fetch
  useEffect(() => {
    async function fetchSubs() {
      const result = await GetSubs(gameID);
      setSubs(result);
    }
    fetchSubs();
  }, [gameID]);

  function CreateSubs(sub) {
    return (
      <Sub
        key={sub.user_name}
        name={sub.user_name}
        score={sub.score}
        url={sub.image_url}
      />
    );
  }

  return (
    <div className="Gamepage">
      <h1>pixa {gameID}</h1>
      <div className="ImageAndSubs">
        <div className="imagee">
          <img src="./images/robot.png" alt="" />
        </div>

        <div className="subs">{subs.map(CreateSubs)}</div>
      </div>

      <div className="buttons">
        <button>לתמונה הבאה</button>
      </div>
    </div>
  );
}
