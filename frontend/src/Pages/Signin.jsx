import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");

  const [index, setIndex] = useState(3);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // 🔹 New state
  const url = "https://api.dicebear.com/9.x/bottts/svg?seed=";

  const GoToWait = () => {
    if (name === '' || image === '') {
      return alert("Please fill in all fields before proceeding");
    }
    fetch('http://localhost:5000/inserUser', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId, name, image }),
    })
      .then(response => {
        if (response.ok) {
          navigate('/waiting?ids=' + gameId);
        } else {
          alert("something wrong with the server please try again");
        }
      });
  };

  const handleImageClick = (imgUrl, idx) => {
    setImage(imgUrl);
    setSelectedImageIndex(idx); // 🔹 Track selected index
  };

  return (
    <div className="LoginPage">
      <img style={{ width: "350px" }} src="images/pixalogo.svg" alt="" />
      <div className="JoingameContent ItemsRight gap15 autohight">
        <h1>שם</h1>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <h1>בחירת דמות</h1>
        <div className='choosePic'>
          <button onClick={() => setIndex(index + 3)}>{"<"}</button>

          {[0, 1, 2].map(i => {
            const imgIndex = index + i;
            const imgUrl = url + imgIndex;
            return (
              <img
                key={imgIndex}
                src={imgUrl}
                alt=""
                onClick={() => handleImageClick(imgUrl, imgIndex)}
                style={{
                  cursor: 'pointer',
                  border: selectedImageIndex === imgIndex ? '2px solid grey' : 'none',
                  borderRadius: '8px',
                  padding: '2px',
                }}
              />
            );
          })}

          <button onClick={() => setIndex(index - 3)}>{">"}</button>
        </div>
        <button onClick={GoToWait}>next</button>
      </div>
      <p>רק לאחר שתיצרו משחק תקבלו קוד התחברות למשחק</p>
    </div>
  );
}
