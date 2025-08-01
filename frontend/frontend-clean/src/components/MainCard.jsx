import { useNavigate } from 'react-router-dom';



function MainCard(){
  const navigate = useNavigate();

  const GoToGame = () => {
    navigate('/game');
  };


    return(<div className="MainCard">
        <button onClick={GoToGame}>כניסת מורים</button>
        <button id="but" className="transbutton">כניסת תלמידים</button>
    </div>)
}

export default MainCard;