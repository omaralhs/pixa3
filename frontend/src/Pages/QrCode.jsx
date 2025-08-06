import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useLocation } from 'react-router-dom';

export default function QrCode() {
  const [qrImageUrl, setQrImageUrl] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gameId = searchParams.get("ids");

  useEffect(() => {
    QRCode.toDataURL(`${window.location.origin}/game_phone?${gameId}`, { width: 512 }, (err, url) => {
      if (err) console.error(err);
      else setQrImageUrl(url);
    });
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
        </div>
      </div>

      <div className="divButtons qrButtons">
        <button className="backButton">back</button>
        <button>next</button>
      </div>
    </div>
  );
}
