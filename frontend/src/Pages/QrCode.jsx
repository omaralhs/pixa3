import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useLocation, useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';
import { io } from 'socket.io-client';
import API_URL from '../config';

export default function QrCode() {
  const navigate = useNavigate();
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");

  // Function to fetch users from backend
  const fetchUsers = async () => {
    if (!gameId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/gameusers?ids=${gameId}`, {
        credentials: 'include',
      });
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate QR code when gameId changes
    if (gameId) {
      QRCode.toDataURL(`${window.location.origin}/game_phone?${gameId}`, { width: 512 }, (err, url) => {
        if (err) console.error(err);
        else setQrImageUrl(url);
      });
    }

    // Fetch initial users
    fetchUsers();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    // Connect socket.io client
    const socket = io(API_URL.replace('/api', ''));

    // Join the game room to listen for events related to this game
    socket.emit('waiting_for_users', gameId);

    // Listen for userJoined events to update the users list
    socket.on('userJoined', () => {
      console.log('User joined event received, refreshing user list...');
      fetchUsers();
    });

    // Clean up socket on component unmount
    return () => {
      socket.disconnect();
    };
  }, [gameId]);

  // Navigation handlers
  const GoToStudentTips = () => {
    navigate('/student_tips?ids=' + gameId);
  };

  const goToChooseimages = () => {
    navigate('/choose2images');
  };

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
          <div className="ListOfUsers">
            {loading ? (
              <p>Loading users...</p>
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserCard
                  image={user.avatar}
                  name={user.firstname}
                  key={user.id}
                  user={user}
                />
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
