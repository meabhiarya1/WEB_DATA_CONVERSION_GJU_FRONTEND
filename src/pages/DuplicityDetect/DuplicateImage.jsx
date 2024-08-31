import React from "react";
import { REACT_APP_IP } from "../../services/common";

const DuplicateImage = ({ currentImageIndex, currentRowData, imageUrl }) => {

  return (
    <div className="mx-auto max-w-screen-xl px-2 lg:py-1 sm:px-6 lg:px-8">
      <h2 className="text-center text-lg my-3 font-bold text-white w-full ">
        {currentImageIndex + 1} out of {currentRowData?.imagePaths.length}
      </h2>

      <div className=" flex justify-center ">
        <div className="">
          {imageUrl && (
            <div
              style={{
                position: "relative",
              }}
              className="w-full overflow-y-auto pb-4"
            >
              <img
                // src={`data:image/jpeg;base64,${imageUrl}`}
                src={`http://${REACT_APP_IP}:4000/images/${imageUrl}`}
                alt="Selected"
                style={{
                  width: "48rem",
                  height: "49rem",
                }}
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuplicateImage;
