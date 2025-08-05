export default function QrCode() {
  return (
    <div className="Gamepage">
      <img className='imglogo' src="images/plailogo.svg" alt="logo" />
      <div className="QRcontainer">
        <div className="GameCode">
            <img src="images/robot.png" alt="QR Code" />
            <p>Game Code: <br /> 12345 </p>  
        </div>
        
        <div className="usersjoined">
            <h1>Users Joined</h1>
            
        </div>        
      </div>
      <h1>QR Code Page</h1>
      <p></p>
      {/* Add your QR code component here */}
    </div>
  );
}