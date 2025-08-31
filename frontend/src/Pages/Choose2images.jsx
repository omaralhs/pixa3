import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default  function Choose2images() {
  const navigate = useNavigate();
 

    useEffect(() => {
        fetch('http://localhost:5000/getimages', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => setImages(data))
        .catch(err => console.error(err));
    }, []);

     const GoToGame = () => {
          if(selectedImages.length <= 0)
            {
            return alert("Please select 2 images before proceeding");
            }
         else{
                const ids=Math.floor(10000 + Math.random() * 90000).toString();
        fetch('http://localhost:5000/creategame', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                 image1: selectedImages[0]?.id,
                 image2: selectedImages[1]?.id,
                 ids:ids
,})
        })
        .then(() => navigate(`/qr_code?ids=${ids}`))
        .catch(err => console.error(err));
    };}

    const GoToTips = () => {
         navigate('/teacher_tips');
        };
    
    function addImage(image) {
        // If already 2 images selected, alert and return
        if(selectedImages.includes(image)){
            return alert("You have already selected this image");
        };
        // Limit to 2 images
        if (selectedImages.length ===2){
            return alert("You can only select 2 images at a time");
        }
        const newSelectedImages = [...selectedImages, image];
        setSelectedImages(newSelectedImages);
    }
    
    function removeSelectedImages(image) {
        const newSelectedImages = selectedImages.filter(img => img !== image);
        setSelectedImages(newSelectedImages);
    }
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
  return (
   <div className="Gamepage1">
        <div className="MainGroupimages">
            <div className="choosenimages">
                <h1>התמונות הנבחרות:  </h1>
                <div className="choosenimages2">
                {selectedImages.map((image, index) => (
                    <div key={index} className="image-item half">
                        <img src={image.url} alt={image.name} />
                        <button className='icon' onClick={() => removeSelectedImages(image)}>X</button>
                    </div>
                ))}
                 </div>
            </div>
           <div className='allimagesContainer'>
            <h1>מאגר תמונות</h1>
            <div className="allimages">
                {images.map((image, index) => (
                    <div key={index} className="image-item">
                        <img onClick={() => addImage(image)} src={image.url} alt={image.name} />
                        {selectedImages.includes(image) && (<button className='icon' onClick={() => removeSelectedImages(image)}>X</button>)}
                        
                    </div>
                ))}
            </div>
            </div>
        </div>

        <div className="divButtons">
            <button onClick={GoToTips} className="backButton">back</button>
            <button onClick={GoToGame}>next</button>
        </div>
        
   </div>
  );
}