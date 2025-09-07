import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export default function ScoreBoard() {
  const [images, setImages] = React.useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");
  function gotopage() {
    navigate('/');
  }
  React.useEffect(() => {
    setImages([
      "https://api.dicebear.com/9.x/bottts/svg?seed=1",
      "https://api.dicebear.com/9.x/bottts/svg?seed=2",
      "https://api.dicebear.com/9.x/bottts/svg?seed=3"
    ]);
  }, []); 

  return (
    <div className="scoreboard-page">
      <img className="img1" src="images/fireworks2.svg" alt="fire" />
      <img className="img2" src="images/fireworks.svg" alt="fire" />
      <button onClick={gotopage} className='exitbutt'>יציאה</button>
      <div className="scoreboard-content">
        <div className="lines">
          <div className="line1">
            <img className='userimg' src={images[1]} alt="" />
            <div className="bubble">
              <h2>Omar</h2>
              <p>4 points</p>
            </div>
            <img className="block" src="images/topline1.svg" alt="" />
            <div className="backgroundline1">
              <img className="imgnumber" src="images/number2.svg" alt="" />
            </div>
          </div>
          <div className="line1">
            <img className='userimg' src={images[1]} alt="" />
            <div className="bubble">
              <h2>Omar</h2>
              <p>4 points</p>
            </div>
            <img className="block" src="images/topline1.svg" alt="" />
            <div className="backgroundline2">
              <img className="imgnumber" src="images/number1.svg" alt="" />
            </div>
          </div>
          <div className="line1">
            <img className='userimg' src={images[1]} alt="" />
            <div className="bubble">
              <h2>Omar</h2>
              <p>4 points</p>
            </div>
            <img className="block" src="images/topline2.svg" alt="" />
            <div className="backgroundline3">
              <img className="imgnumber" src="images/number3.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
