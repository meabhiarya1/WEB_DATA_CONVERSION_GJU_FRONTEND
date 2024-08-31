import JSZip from "jszip";

// Function to extract images from a zip file
const extractImagesFromZip = async (zipFile) => {
  const zip = await JSZip.loadAsync(zipFile);
  const images = [];

  // Create an array to store all promises
  const promises = [];

  // Iterate over each file in the zip
  zip.forEach((relativePath, file) => {
    if (!file.dir && /\.(jpg|jpeg|png|gif)$/i.test(relativePath)) {
      // If the file is not a directory and has a supported image extension
      // Convert the file to a data URL and add it to the images array
      const promise = new Promise((resolve, reject) => {
        file
          .async("blob")
          .then((blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              const fileName = file.name.split("/").pop();
              images.push({ imgName: fileName, imgUrl: reader.result });
              resolve(); // Resolve the promise once the image is added
            };
            reader.readAsDataURL(blob);
          })
          .catch(reject); // Pass any errors to the promise
      });
      promises.push(promise);
    }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  return images;
};

export default extractImagesFromZip;
