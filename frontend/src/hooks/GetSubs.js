import API_URL from '../config';

export default async function GetSubs(game_id) {
  const response = await fetch(`${API_URL}/GetSubs`, {
    credentials: 'include',
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_id }),

  });
  const data = await response.json(); // or response.text(), depends on your backend
  console.log(data);
  return data;
}