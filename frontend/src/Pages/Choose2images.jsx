import React, { useState, useEffect } from 'react';
export default  function Choose2images() {

    useEffect(() => {
        fetch('http://localhost:5000/getimages', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => setImages(data))
        .catch(err => console.error(err));
    }, []);

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
   </div>
  );
}