import { useState } from 'react';
import OtpInput from 'react-otp-input';
import {  useNavigate } from 'react-router-dom';
import API_URL from '../config';

export default function JoinGame() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  
  const GoToWait = () => {
    const res=fetch(`${API_URL}/join_game`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  otp }),
    })
    res.then(response => {
      if (response.ok) {
        navigate('/signin?ids=' + otp);
      }
      else {
        alert("Invalid OTP or Game ID");
      }});

    }

  return (
    <div className="LoginPage">
      <img style={{width:"350px"}} src="images/pixalogo.svg" alt="" />
      <div className="JoingameContent">
        <div className='JoingameHeader'>
          <button>{"<"}</button>
          <h1>קוד משחק</h1>
        </div>
        
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={5}
          renderSeparator={null}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            width: '40px',
            height: '70px',
            margin: '0 5px',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none'
            
          }}
          focusStyle={{
            border: '2px solid #007bff',
            outline: 'none'
          }}
        />
        
        <button 
          onClick={GoToWait}
          disabled={otp.length !== 5}
        >
          next
        </button>
      </div>
      <p>רק לאחר שתיצרו משחק 
תקבלו קוד התחברות למשחק</p>
    </div>
  );
}