import React, { useState } from "react";

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex">
      <button onClick={goToPrevSlide}>Previous</button>
      <img src={images[currentIndex]} alt={`Image ${currentIndex}`} />
      <button onClick={goToNextSlide}>Next</button>
    </div>
  );
}

export default ImageCarousel;
