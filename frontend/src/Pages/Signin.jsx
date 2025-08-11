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
  const url= "https://api.dicebear.com/9.x/bottts/svg?seed=";
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
        })
    }

  return (
    <div className="LoginPage">
      <img style={{width:"350px"}} src="images/pixalogo.svg" alt="" />
      <div className="JoingameContent ItemsRight gap15 autohight">
        <h1>שם</h1>
        <input
         type="text" 
         name="" id="" 
         value={name}
         onChange={e => setName(e.target.value)} /> 
        <h1>בחירת דמות</h1>
        <div className='choosePic'>
            <button  onClick={()=>setIndex(index+3)}>{"<"}</button>
            <img onClick={()=>setImage(url+index)} src={url+index} alt="" />
            <img onClick={()=>setImage(url+(index+1))} src={url+(index+1)} alt="" />
            <img onClick={()=>setImage(url+(index+2))} src={url+(index+2)} alt="" />
            <button onClick={()=>setIndex(index-3)}>{">"}</button>

        </div>
        <button onClick={GoToWait}>next</button>
      </div>
      <p>רק לאחר שתיצרו משחק 
תקבלו קוד התחברות למשחק</p>
    </div>
  );
}