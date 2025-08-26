import { useState } from 'react';
import SaveSub from '../hooks/SaveSub';

export default function useImageGenerator(Gameid, setTrys) {
  const [prompt, setPrompt] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("נא להזין פרומפט");

    setLoading(true);
    setImageURL('');

    try {
      const response = await fetch("http://localhost:5000/gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.imageURL) {
        setImageURL(data.imageURL);

        // ✅ call SaveSub automatically after successful generate
        SaveSub(
          prompt,
          data.imageURL,
          "RAN M",                 // you can replace these with real user data
          "GOOD PROMPT MY BOY",
          "77",
          Gameid,
          setTrys
        );
      } else {
        alert("לא התקבלה תמונה");
      }
    } catch (error) {
      console.error("שגיאה בשליחת הפרומפט:", error);
      alert("שגיאה בשרת");
    } finally {
      setLoading(false);
    }
  };

  return { prompt, setPrompt, imageURL, loading, handleGenerate };
}
