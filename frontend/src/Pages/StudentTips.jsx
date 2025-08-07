import { useNavigate } from 'react-router-dom';



export default function StudentTips() {
    const navigate = useNavigate();
    const GoToGame = () => {
        navigate('/game');
    };
    const goToQrCode = () => {
        navigate('/qr_code');
    }

  return (
    <div className="StudentTips Gamepage">
      <img className="imglogo" src="images/pixalogo.svg" alt="logo" />
      <div className="StudentTipsContent">
        <div className="maintips">
        <h1>עכשיו מתחילה התחרות:</h1>
        <h2>המטרה שלכם היא לנסח פרומפט שייצר תמונה הכי דומה לתמונה שהמורה בחרה.</h2>
        <div className="Listoftips">
            <div className="GameTip" >
                <h2>1</h2>
                <p>המורה יציג תמונה  על הלוח או במסך.</p>
            </div>
            <div className="GameTip" >
                <h2>2</h2>
                <p>כתבו (הנחיה) לב”מ שמתארת את התמונה  📝 <br /> *התמונה שתיצרו תופיע על המסך</p>
            </div>
            <div className="GameTip" >
                <h2>3</h2>
                <p>המערכת תשלח טיפ שיעזור לכם לדייק את הפרומפט
                    ולאחר מכן  נסו לשפר את הפרומפט </p>
            </div>
            <div className="GameTip" >
                <h2>4</h2>
                <p>בסיום הסבבים ויצירת כל התמונות, המערכת תכריז על הזוכים 🏆🎉</p>
            </div>
        </div>
        </div>
        <div className="divButtons" style={{width :"100%"}}>
            <button onClick={goToQrCode} className="backButton">back</button>
            <button onClick={GoToGame} >next</button>
        </div>
        
        </div>
      
      <div></div>
    </div>
  );
}