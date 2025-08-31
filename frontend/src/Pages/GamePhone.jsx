import '../Game.css';
import '../App.css';
import Tip from '../components/Tip';
import useImageGenerator from '../hooks/useImageGenerator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Call this on success:
function GamePhone() {
  const [searchParams] = useSearchParams();
  const [tip, setTip]=useState("")
  const [score,setScore]=useState(0);
  const Gameid = searchParams.get('ids'); // Gets the value of the `id` parameter
  const [trys,setTrys]=useState(0);
  const { prompt, setPrompt, imageURL, loading, handleGenerate } = useImageGenerator(Gameid, setTrys, setTip, setScore);



   useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/gettrys?gameid=${Gameid}`,{
        credentials: 'include',
      });
      const data = await res.json();
      setTrys(data.trys);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();

// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  return (
    <div className="Gamepage">
      <img className='imglogo' src="images/plailogo.svg" alt="logo" />
      <ToastContainer />
      <div className="ImageAndSubs">
        <div className="imagee">
          {!imageURL ? <h1>your image will show up here</h1> : <img src={imageURL} alt="Generated" />}
        </div>

        <div className="inputsandtips">
          <div className="InputIcon">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="הכנס פרומפט"
            />
            <button
             onClick={handleGenerate}
             disabled={trys === 2 || loading }
            >send</button>
          </div>

          {imageURL ? 
           <div>
          <div className='UserTip'>
            <h1>Tip</h1>
            <p>{tip}</p>
          </div>
           <div className='score'>
            <h1>Score</h1>
            <p>{score}</p>
          </div>

          </div>
          
          :

          <div>
            <h3>איך לכתוב פרומט שייצר תמונה זהה:</h3>
            <Tip title={"להיות מדויקים"} tip={"לתאר את הפרטים המרכזים בתמונה"} />
            <Tip title={"להיות מדויקים"} tip={"לתאר את הפרטים המרכזים בתמונה"} />
          </div>
            }
        </div>
      </div>
      <div></div>
      {loading && <p>טוען תמונה...</p>}
    </div>
  );
}

export default GamePhone;