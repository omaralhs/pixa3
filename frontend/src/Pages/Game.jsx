import React, { useState, useEffect } from 'react';
import '../App.css';
import '../Game.css';
import GetSubs from '../hooks/GetSubs';
import Sub from '../components/Sub';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Game() {
  const [subs, setSubs] = useState([]);
  const [images, setImages] = useState([]); // store image objects {id, url}
  const [imageNumber, setImageNumber] = useState(1); // starts at 1
  const [searchParams] = useSearchParams();
  const gameID = searchParams.get('ids'); // get game id from URL

  // Navigate to scoreboard
  function GoToScoreboard() {
    window.location.href = `/scoreboard?ids=${gameID}`;
  }

  // Socket.io for live subs updates
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.emit("waiting_for_subs", gameID);

    socket.on("subs_updated", async () => {
      const result = await GetSubs(gameID);
      setSubs(result);
    });

    return () => {
      socket.disconnect();
    };
  }, [gameID]);

  // Initial fetch of subs
  useEffect(() => {
    async function fetchSubs() {
      const result = await GetSubs(gameID);
      setSubs(result);
    }
    fetchSubs();
  }, [gameID]);

  // Fetch images for the game
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`http://localhost:5000/game-images?gameID=${gameID}`,
          {     credentials: 'include',
          }
        );
        const data = await res.json();
        setImages(data.images); // [{id, url}, ...]
        console.log("Fetched images:", data.images); // ← see the array in console

      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    }
    fetchImages();
  }, [gameID]);

  // Render each subscriber
  function CreateSubs(sub) {
    return (
      <Sub
        key={sub.id}
        name={sub.user_name}
        score={sub.score}
        url={sub.image_url}
      />
    );
  }

  return (
    <div className="Gamepage">
      <h1>pixa </h1>

      <div className="ImageAndSubs">
        <div className="imagee">
          {images.length > 0 ? (
            <img src={images[imageNumber - 1].url} alt={`robot pic ${imageNumber}`} />
          ) : (
            <p>Loading images...</p>
          )}
        </div>

        <div className="subs">
          {subs.map(CreateSubs)}
        </div>
      </div>

      <div className="buttons">
        <button
          onClick={
            imageNumber >= images.length
              ? GoToScoreboard
              : () => setImageNumber(prev => prev + 1)
          }
        >
          לתמונה הבאה
        </button>
      </div>
    </div>
  );
}
