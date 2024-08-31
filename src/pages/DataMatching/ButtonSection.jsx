import React from "react";

const ButtonSection = ({
  currentIndex,
  csvData,
  zoomInHandler,
  onInialImageHandler,
  zoomOutHandler,
  currentImageIndex,
  imageUrls,
}) => {
  return (
    <div className="flex justify-between">
      <h3 className="ms-5 text-lg font-semibold py-3 text-white">
        Data No : {currentIndex} out of {csvData.length - 1}
      </h3>
      <div className="flex justify-center my-3">
        <button
          onClick={zoomInHandler}
          className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-500"
        >
          Zoom In
        </button>

        <button
          onClick={onInialImageHandler}
          className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-500"
        >
          Initial
        </button>
        <button
          onClick={zoomOutHandler}
          className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-500"
        >
          Zoom Out
        </button>
      </div>
      <h3 className=" text-lg font-semibold py-3 text-white">
        {" "}
        Image : {currentImageIndex + 1} Out of {imageUrls.length}
      </h3>
    </div>
  );
};

export default ButtonSection;
