import { toast } from 'react-toastify';
import API_URL from '../config';

export default async function saveSubmission(prompt, imageURL,user_name,tip,score,game_id,setTrys,SetTip,SetScore) {
  const res = await fetch(`${API_URL}/save`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageURL,user_name,score,tip,game_id }),
  });
 const data = await res.json();
    if (res.ok) {
      // Update trys state with the value returned from the backend
      if (setTrys && data.numberOfTrys !== undefined) {
        setTrys(data.numberOfTrys);
        SetTip(data.Tip)
        SetScore(data.Score)
      }
    }  
  toast.success("ההגשה נשמרה בהצלחה!");
  
}