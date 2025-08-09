import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function JoinGame() {
  const navigate = useNavigate();
  const GoToWait = () => {
    navigate('/student_tips?ids=' + gameId);
  };
  

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");


  return (
    <div className="Gamepage">

      <div className="JoingameContent">

        <button onClick={GoToWait}>next</button>
      </div>

    </div>
  );
}