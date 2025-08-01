export default async function saveSubmission(prompt, imageURL,user_name,tip,score) {
  const res = await fetch('http://localhost:5000/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageURL,user_name,score,tip }),
  });
  console.log(res)
  console.log("in front")
}