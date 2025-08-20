import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';
export default function QrCode() {
  const navigate = useNavigate();
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");

  const GoToStudentTips = () => {
    navigate('/student_tips?ids=' + gameId);
  };
  
  const goToChooseimages = () => {
    navigate('/choose2images');
  }

  // Fetch users for the game
useEffect(() => {
  // Generate QR Code
  QRCode.toDataURL(`${window.location.origin}/game_phone?${gameId}`, { width: 512 }, (err, url) => {
    if (err) console.error(err);
    else setQrImageUrl(url);
  });

  // Fetch users when component mounts
  if (gameId) {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/gameusers?ids=${gameId}`);
        const userData = await response.json();
        setUsers(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }
}, [gameId]);

  return (
    <div className="Gamepage">
      <img className="imglogo" src="images/plailogo.svg" alt="logo" />
      <div className="QRcontainer">
        <div className="GameCode">
          <div className="image_Wrapper">
            {qrImageUrl && (
              <img src={qrImageUrl} alt="QR Code" className="qr-image" />
            )}
          </div>
          <div className="text-wrapper">
            <p>Game Code:</p>
            <p>{gameId}</p>
          </div>
        </div>
        <div className="usersjoined">
          <h1>:משתמשים השתתפו</h1>
         <div className='ListOfUsers'>
  {loading ? (
    <p>Loading users...</p>
  ) : users.length > 0 ? (
    users.map((user) => (
      <UserCard image={user.avatar} name={user.firstname} key={user.id} user={user} />
    ))
  ) : (
    <p>No users joined yet</p>
  )}
</div>
           
        </div>
      </div>
      <div className="divButtons qrButtons">
        <button onClick={goToChooseimages} className="backButton">back</button>
        <button onClick={GoToStudentTips}>next</button>
      </div>
    </div>
  );
}