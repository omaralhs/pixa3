import { toast } from 'react-toastify';

export default async function saveSubmission(prompt, imageURL,user_name,tip,score,game_id) {
  const res = await fetch('http://localhost:5000/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageURL,user_name,score,tip,game_id }),
  });
  console.log(res)
  toast.success("ההגשה נשמרה בהצלחה!");
  
}