import { REACT_APP_IP } from "../../services/common";

const ImageSection = ({
  imageContainerRef,
  currentImageIndex,
  imageUrls,
  imageRef,
  zoomLevel,
  selectedCoordintes,
  templateHeaders,
}) => {
  const imageUrl = imageUrls[currentImageIndex];


  return (
    <div
      ref={imageContainerRef}
      className="mx-auto bg-white rounded-lg shadow-lg"
      style={{
        position: "relative",
        border: "2px solid #007bff",
        width: "55rem",
        height: "23rem",
        overflow: "auto",
        scrollbarWidth: "thin",
        display: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl ? (
        <img
          src={`http://${REACT_APP_IP}:4000/images/${imageUrl}`}
          alt="Selected"
          ref={imageRef}
          style={{
            width: "48rem",
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.8)",
          }}
          draggable={false}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff0000",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Image not found
        </div>
      )}

      {/* {!selectedCoordintes &&
        templateHeaders?.templetedata?.map(
          (data, index) =>
            data.pageNo === currentImageIndex && (
              <div
                key={index}
                style={{
                  border: "2px solid rgba(0, 123, 255, 0.8)",
                  position: "absolute",
                  backgroundColor: "rgba(0, 123, 255, 0.2)",
                  left: `${data.coordinateX}px`,
                  top: `${data.coordinateY}px`,
                  width: `${data.width}px`,
                  height: `${data.height}px`,
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                  borderRadius: "0.25rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              ></div>
            )
        )} */}
    </div>
  );
};

export default ImageSection;