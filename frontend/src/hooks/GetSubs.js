export default async function GetSubs() {
  console.log("in hereeee");
  const response = await fetch('http://localhost:5000/GetSubs', {
    method: "POST"
  });
  const data = await response.json(); // or response.text(), depends on your backend
  console.log(data);
  return data;
}