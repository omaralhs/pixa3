import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Waiting() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");

  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/getUser',{  credentials: 'include'
})
      .then(response => response.json())
      .then(data => {
        setName(data.firstname);   // Make sure your backend returns { name, image }
        setImage(data.avatar);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, [gameId]); // Only run when gameId changes

  return (
    <div className="LoginPage">
      <p>{name}</p>
      <img style={{width:"50px", height:"50px"}} src={image} alt="" />
      <p>sadasdasdasdasdasd</p>
    </div>
  );
}