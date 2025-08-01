import '../Game.css';
import '../App.css';
import Tip from '../components/Tip';
import useImageGenerator from '../hooks/useImageGenerator';
import SaveSub from '../hooks/SaveSub';

function GamePhone() {
  const { prompt, setPrompt, imageURL, loading, handleGenerate } = useImageGenerator();
  



  return (
    <div className="Gamepage">
      <h1>qweasd</h1>
      <div className="ImageAndSubs">
        <div className="imagee">
          <img src={imageURL || "./images/robot.png"} alt="Generated" />
        </div>

        <div className="inputsandtips">
          <div className="InputIcon">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="הכנס פרומפט"
            />
            <button onClick={handleGenerate}>send</button>
          </div>

          <h3>איך לכתוב פרומט שייצר תמונה זהה:</h3>
          <Tip title={"להיות מדויקים"} tip={"לתאר את הפרטים המרכזים בתמונה"} />
          <Tip title={"להיות מדויקים"} tip={"לתאר את הפרטים המרכזים בתמונה"} />
        </div>
      </div>
      <button onClick={()=>SaveSub(prompt,imageURL,"RAN M","GOOD PROMPT MY BOY","77")}>submit</button>
      {loading && <p>טוען תמונה...</p>}
    </div>
  );
}

export default GamePhone;