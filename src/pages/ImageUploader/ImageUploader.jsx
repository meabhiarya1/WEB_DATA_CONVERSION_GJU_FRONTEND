import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadIcon from "../../assets/images/uploaderIcon.png";
import { toast } from "react-toastify";
import UTIF from "utif";
import InstructionPage from "../../components/InstuctionPage/InstructionPage";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [imageNames, setImageNames] = useState([]);
  const [openUpload, setOpenUpload] = useState(true);
  const [instruction, setInstuction] = useState(false);
  const navigate = useNavigate();

  // Function to handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    handleImages(files);
  };

  // Function to handle both image selection and drop
  const handleImages = (files) => {
    if (!files || files.length === 0) return;

    const newImages = [];
    const newImageNames = [];
    let processedCount = 0;

    const updateImages = () => {
      if (processedCount === files.length) {
        setImages((prevImages) => [...prevImages, ...newImages]);
        setImageNames((prevImageNames) => [
          ...prevImageNames,
          ...newImageNames,
        ]);
        toast.success("Images selected successfully.");
      }
    };

    const handleFileLoad = (file, data) => {
      if (file.type === "image/tiff") {
        const arrayBuffer = data;
        const ifds = UTIF.decode(arrayBuffer);
        let pagesProcessed = 0;

        ifds.forEach((ifd, index) => {
          UTIF.decodeImage(arrayBuffer, ifd);
          const rgba = UTIF.toRGBA8(ifd);

          // Check if width and height are valid
          if (ifd.width && ifd.height && rgba) {
            const canvas = document.createElement("canvas");
            canvas.width = ifd.width;
            canvas.height = ifd.height;
            const ctx = canvas.getContext("2d");
            const imageData = new ImageData(
              new Uint8ClampedArray(rgba),
              ifd.width,
              ifd.height
            );
            ctx.putImageData(imageData, 0, 0);

            canvas.toBlob((blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64data = reader.result;
                newImages.push(base64data);
                newImageNames.push(`${file.name} - Page ${index + 1}`);
                pagesProcessed++;
                if (pagesProcessed === ifds.length) {
                  processedCount++;
                  updateImages();
                }
              };
              reader.readAsDataURL(blob);
            }, "image/jpeg");
          } else {
            console.error("Invalid TIFF image data:", ifd);
            pagesProcessed++;
            if (pagesProcessed === ifds.length) {
              processedCount++;
              updateImages();
            }
          }
        });
      } else {
        newImages.push(data);
        newImageNames.push(file.name);
        processedCount++;
        updateImages();
      }
    };

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => handleFileLoad(file, reader.result);

      if (file.type === "image/tiff") {
        setOpenUpload(!openUpload);
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFinalSubmit = () => {
    setInstuction(false);
    if (images.length === 0) {
      toast.warning("Please select the images.");
      return;
    }
    if (images.every((image) => image)) {
      localStorage.setItem("images", JSON.stringify(images));
      localStorage.setItem("templateOption", JSON.stringify("creating"));
      navigate("/imageuploader/scanner");
    } else {
      toast.error("Please upload all required images.");
    }
  };

  return (
    <div>
      <section className="bgImage flex justify-center items-center w-full  bg-gradient-to-r from-blue-400 to-blue-600">
        <div className="mx-auto max-w-screen-sm lg:flex lg:h-screen lg:items-center">
          <div className=" border-2 border-white backdrop-blur  rounded-3xl px-16 py-10 shadow-white shadow-sm">
            <div className="text-white z-10">
              <h1 className="text-white text-center text-4xl mb-12 font-bold">
                OMR India Outsources
              </h1>
            </div>

            <div>
              {imageNames.map((name, index) => (
                <div
                  key={index}
                  className="text-white text-center text-lg mb-2"
                >
                  {name}
                </div>
              ))}
            </div>

            {openUpload && (
              <div className="relative flex justify-center mt-8">
                <label
                  className="flex items-center font-medium text-white bg-blue-600 rounded-3xl shadow-md cursor-pointer select-none text-lg px-6 py-3 hover:shadow-xl active:shadow-md"
                  htmlFor="file-upload"
                >
                  <img src={uploadIcon} alt="uploadIcon" className="mr-2" />
                  <span>Upload Images</span>
                </label>
                <input
                  onChange={handleImageChange}
                  id="file-upload"
                  type="file"
                  className="absolute -top-full opacity-0"
                  accept=".tiff,.tif,.jpeg,.jpg"
                  multiple
                />
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setInstuction(true)}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-full shadow-md focus:outline-none transform transition-transform duration-300 hover:scale-105"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <InstructionPage
          setInstuction={setInstuction}
          instruction={instruction}
          handleFinalSubmit={handleFinalSubmit}
        />
      </section>
    </div>
  );
};

export default ImageUploader;
