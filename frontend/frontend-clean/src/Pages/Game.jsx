import '../App.css';
import '../Game.css';

export default function Game(){
    return(
    <div className="Gamepage">
        <h1>pixa</h1>
         <div className='ImageAndSubs'>
            <div className='imagee'>
                <img src="./images/robot.png" alt="" />
            </div>

            <div className='subs'></div>
        </div>  

        <div className='buttons'>
        <button>לתמונה הבאה</button>   
 
        </div> 
    </div>)
}