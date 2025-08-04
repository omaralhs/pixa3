import { useNavigate } from 'react-router-dom';




export default function TeacherTips() {
    
  const navigate = useNavigate();

  const GoTo2images = () => {
    navigate('/choose2images');
  };
   const GoToindex = () => {
    navigate('/');
  };

  return (
    <div className="Gamepage1">
        <div className="MainGroup">
<          h1>PIXA -ברוכים הבאים ל </h1>
            <h2>משחק  לפיתוח אוריינות בינה מלאכותית המפתח דיוק לשוני, חשיבה ביקורתית ויצירתיות</h2>
            <p>במהלך המשחק, המורה בוחרת תמונה מתוך מאגר , מציגה אותה לתלמידים ואלו מנסחים פרומפטים (הנחיות טקסטואליות) כדי לשחזר את התמונה בעזרת AI.</p>
            <p>  המערכת משווה בין התמונה שיצרו לתמונה המקורית על סמך 70% התאמה ויזואלית ו-30% התאמה בין הפרומפטים, ומחזירה לכל תלמיד ציון אישי, משוב והמלצות לשיפור.</p>
            <h6>משך המשחק: בין 15-30 דקות ( תלוי בקצב של הקבוצה)</h6>
            <h5>הסבר מפורט על שלבי המשחק</h5>
        </div>
        <div className="divButtons">
            <button onClick={GoToindex} className="backButton">back</button>
            <button onClick={GoTo2images}>next</button>
        </div>
      
    </div>
  );
}