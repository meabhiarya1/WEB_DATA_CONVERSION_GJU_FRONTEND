import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ImageNotFound from "../../components/ImageNotFound/ImageNotFound";
import { toast } from "react-toastify";
import {
  onGetTaskHandler,
  onGetTemplateHandler,
  onGetVerifiedUserHandler,
  REACT_APP_IP,
} from "../../services/common";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import AdminAssined from "./AdminAssined";
import UserTaskAssined from "./UserTaskAssined";
import FormDataSection from "./FormDataSection";
import QuestionsDataSection from "./QuestionsDataSection";
import ImageSection from "./ImageSection";
import ButtonSection from "./ButtonSection";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const DataMatching = () => {
  const [popUp, setPopUp] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);
  const [templateHeaders, setTemplateHeaders] = useState(null);
  const [csvCurrentData, setCsvCurrentData] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [imageColName, setImageColName] = useState("");
  const [imageColNames, setImageColNames] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTaskData, setCurrentTaskData] = useState({});
  const [selectedCoordintes, setSelectedCoordinates] = useState(false);
  const [modifiedKeys, setModifiedKeys] = useState({});
  const [imageNotFound, setImageNotFound] = useState(true);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [compareTask, setCompareTask] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState();
  const [userRole, setUserRole] = useState();
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const token = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [os, setOs] = useState('Unknown OS');


  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    if (platform.includes('Win')) {
      setOs('Windows');
    } else if (platform.includes('Mac')) {
      setOs('macOS');
    } else if (userAgent.includes('Ubuntu')) {
      setOs('Ubuntu');
    } else if (platform.includes('Linux') || userAgent.includes('Linux')) {
      setOs('Linux');
    } else if (/Android/.test(userAgent)) {
      setOs('Android');
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      setOs('iOS');
    }
  }, []);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const verifiedUser = await onGetVerifiedUserHandler();
        setUserRole(verifiedUser.user.role);
        const tasks = await onGetTaskHandler(verifiedUser.user.id);
        const templateData = await onGetTemplateHandler();
        const uploadTask = tasks.filter((task) => {
          return task.moduleType === "Data Entry";
        });
        const comTask = tasks.filter((task) => {
          return task.moduleType === "CSV Compare";
        });

        const updatedCompareTasks = comTask.map((task) => {
          const matchedTemplate = templateData.find(
            (template) => template.id === parseInt(task.templeteId)
          );
          if (matchedTemplate) {
            return {
              ...task,
              templateName: matchedTemplate.name,
            };
          }
          return task;
        });
        const updatedTasks = uploadTask.map((task) => {
          const matchedTemplate = templateData.find(
            (template) => template.id === parseInt(task.templeteId)
          );
          if (matchedTemplate) {
            return {
              ...task,
              templateName: matchedTemplate.name,
            };
          }
          return task;
        });
        setAllTasks(updatedTasks);
        setCompareTask(updatedCompareTasks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentUser();
  }, [popUp]);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await onGetTemplateHandler();
        const templateData = response.find(
          (data) => data.id === parseInt(currentTaskData.templeteId)
        );
        setTemplateHeaders(templateData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTemplate();
  }, [currentTaskData]);

  // Api for updating the csv data in the backend
  const onCsvUpdateHandler = async () => {
    const csvHeader = csvData[0];
    const formData = templateHeaders?.templetedata?.filter(
      (data) => data.fieldType === "formField"
    );

    const filteredFormData = formData
      .filter((data) => Object.values(csvHeader).includes(data.attribute))
      .map((data) => {
        const key = Object.keys(csvHeader).find(
          (key) => csvHeader[key] === data.attribute
        );
        return { ...data, csvHeaderKey: key };
      });

    for (let i = 0; i < filteredFormData.length; i++) {
      let { dataFieldType, fieldLength, csvHeaderKey } = filteredFormData[i];
      let keyValue = csvCurrentData[csvHeaderKey];
      fieldLength = Number(fieldLength);
      keyValue = keyValue.toString();

      if (dataFieldType === "number") {
        // const [min, max] = fieldRange.split("--").map(Number);
        const blankDefinition = templateHeaders?.blankDefination === "space" ? " " : templateHeaders?.blankDefination;

        if (keyValue.includes(templateHeaders?.patternDefinition)) {
          toast.warning(`The value for ${csvHeaderKey} includes the pattern definition ${"    " + templateHeaders?.patternDefinition}.`);
          return;
        }

        if (keyValue.includes(blankDefinition)) {
          toast.warning(`The value for ${csvHeaderKey} should not include the specified blank definition.`);
          return;
        }

        const keyValueNumber = Number(keyValue);
        if (keyValue.length !== fieldLength) {
          toast.warning(`The length of ${csvHeaderKey} should be ${fieldLength}.`);
          return;
        }

        // if (keyValueNumber < min || keyValueNumber > max) {
        //   toast.warning(`Number ${csvHeaderKey} is out of range. It should be between ${min} and ${max}.`);
        //   return;
        // }
      } else if (dataFieldType === "text") {
        if (keyValue.trim().length === 0) {
          toast.warning(`The ${csvHeaderKey} is empty.`);
          return;
        }

        if (keyValue.length !== fieldLength) {
          toast.warning(`The length of ${csvHeaderKey} should be ${fieldLength}.`);
          return;
        }

        const isValidText = /^[A-Za-z\s]+$/.test(keyValue);
        if (!isValidText) {
          toast.warning(`The ${csvHeaderKey} should be text.`);
          return;
        }
      } else if (dataFieldType === "alphanumeric") {
        if (keyValue === " " || keyValue.length === 0) {
          toast.warning(`The ${csvHeaderKey} is empty.`);
          return;
        }

        if (keyValue.length !== fieldLength) {
          toast.warning(`The length of ${csvHeaderKey} should be ${fieldLength}.`);
          return;
        }

        const isValidAlphanumeric = /^[a-zA-Z0-9\s]+$/.test(keyValue);
        if (!isValidAlphanumeric) {
          toast.warning(`Alphanumeric value ${keyValue} is not valid.`);
          return;
        }
      }
    }

    if (!modifiedKeys) {
      onImageHandler("next", currentIndex, csvData, currentTaskData);
      toast.success("Data updated successfully.");
      return;
    }

    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/updatecsvdata/${parseInt(currentTaskData?.fileId)}`,
        {
          updatedData: csvCurrentData,
          index: csvCurrentData.rowIndex + 1,
          updatedColumn: modifiedKeys,
          imageNameArray: imageUrls
        },
        {
          headers: {
            token: token,
          },
        }
      );

      setCsvData((prevCsvData) => {
        const newCsvData = [...prevCsvData];
        newCsvData[currentIndex] = csvCurrentData;
        return newCsvData;
      });
      setModifiedKeys(null);
      onImageHandler("next", currentIndex, csvData, currentTaskData);
      toast.success("Data updated successfully.");
    } catch (error) {
      console.error("API error:", error);
      toast.error(error.message);
    }
  };

  // Sortcuts buttons
  useEffect(() => {
    if (!popUp) {
      const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === "ArrowLeft") {
          setPopUp(true);
        } else if (
          (os !== 'Ubuntu' && event.altKey && (event.key === 's' || event.key === 'S')) ||
          (os === 'Ubuntu' && event.shiftKey && (event.key === 's' || event.key === 'S'))
        ) {
          setCsvCurrentData((prevData) => ({
            ...prevData,
          }));
          onCsvUpdateHandler();
        } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
          if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
            setSelectedCoordinates(false);
            setZoomLevel(1);

            if (imageRef.current) {
              imageRef.current.style.transform = "none";
              imageRef.current.style.transformOrigin = "initial";
            }
          } else {
            // onImageHandler("prev", currentIndex, csvData, currentTaskData);
            setCurrentImageIndex(0);
          }
        } else if (event.key === "ArrowRight" || event.key === "PageDown") {
          if (currentImageIndex < imageUrls.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            setSelectedCoordinates(false);
            setZoomLevel(1);
            if (imageRef.current) {
              imageRef.current.style.transform = "none";
              imageRef.current.style.transformOrigin = "initial";
            }
          } else {
            // onImageHandler("next", currentIndex, csvData, currentTaskData);
            setCurrentImageIndex(0);
          }
        } else if (event.shiftKey && event.key === "+") {
          zoomInHandler();
          setSelectedCoordinates(true);
        } else if (event.shiftKey && event.key === "-") {
          zoomOutHandler();
          setSelectedCoordinates(true);
        } else if (event.shiftKey && (event.key === "I" || event.key === "i")) {
          onInialImageHandler();
        } else if (event.shiftKey && (event.key === "p" || event.key === "P")) {
          onImageHandler("prev", currentIndex, csvData, currentTaskData);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [csvData, currentTaskData, setCsvCurrentData, onCsvUpdateHandler]);

  // Handle Key
  const handleKeyDownJump = (e, index) => {
    if (e.key === "Tab") {
      e.preventDefault();

      let nextIndex = index;
      let loopedOnce = false;
      const direction = e.shiftKey ? -1 : 1;

      while (!loopedOnce || nextIndex !== index) {
        // Calculate the next index based on direction
        nextIndex =
          (nextIndex + direction + inputRefs.current.length) %
          inputRefs.current.length;

        const [nextKey, nextValue] = Object.entries(csvCurrentData)[nextIndex];
        // Check if nextValue meets the condition
        if (
          nextValue === "" ||
          (nextValue &&
            typeof nextValue === "string" &&
            (nextValue.includes("*") || nextValue.includes(" ")))
        ) {
          // Update focus index
          setCurrentFocusIndex(nextIndex);
          // Ensure the input reference exists and is focusable
          if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
          }
          break;
        }

        // Check if we have looped back to the original index
        if (nextIndex === index) {
          loopedOnce = true;
        }
      }
    } else if ((e.altKey && e.key === "n") || (e.altKey && e.key === "N")) {
      e.preventDefault();

      let nextIndex = index + 1;
      if (nextIndex >= inputRefs.current.length) {
        nextIndex = 0;
      }

      // Update focus index
      setCurrentFocusIndex(nextIndex);
      // Ensure the input reference exists and is focusable
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  // Api for getting the image from the backend
  const onImageHandler = async (
    direction,
    currMatchingIndex,
    csvData,
    taskData
  ) => {
    const headers = csvData[0];
    const getKeysByPattern = (object, pattern) => {
      const regex = new RegExp(pattern);
      return Object.keys(object).filter((key) => regex.test(object[key]));
    };
    const imageNames = [];
    let i = 1;
    while (true) {
      const keys = getKeysByPattern(headers, `Image${i}`);
      if (keys.length === 0) break;
      imageNames.push(...keys);
      i++;
    }
    setImageColNames(imageNames);
    try {
      let newIndex = currMatchingIndex;
      let allImagePaths;
      if (direction === "initial") {
        const objects = csvData[newIndex];
        if (objects && typeof objects === 'object') {
          const trimmedObjects = Object.fromEntries(
            Object.entries(objects).map(([key, value]) => {
              return [key, typeof value === 'string' ? value.trim() : value];
            })
          );
          allImagePaths = imageNames.map((key) => trimmedObjects[key]);
          setCsvCurrentData(trimmedObjects);
        }
      } else {
        newIndex = direction === "next" ? newIndex + 1 : newIndex - 1;
        if (newIndex > 0 && newIndex < csvData.length) {
          setCurrentIndex(newIndex);
          const objects = csvData[newIndex];
          if (objects && typeof objects === 'object') {
            // Create a new object with trimmed values
            const trimmedObjects = Object.fromEntries(
              Object.entries(objects).map(([key, value]) => {
                // Trim the value if it's a string
                return [key, typeof value === 'string' ? value.trim() : value];
              })
            );

            // Process image paths
            allImagePaths = imageNames.map((key) => trimmedObjects[key]);

            // Update state with the trimmed object
            setCsvCurrentData(trimmedObjects);
          }
        } else {
          toast.warning(
            direction === "next"
              ? "All images have been processed."
              : "You are already at the first image."
          );
          return;
        }
      }
      setImageUrls(allImagePaths)
      await axios.post(
        `http://${REACT_APP_IP}:4000/get/image`,
        {
          imageNameArray: allImagePaths,
          rowIndex: csvData[newIndex].rowIndex,
          id: taskData.id,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      // const url = response.data?.base64Image;
      // const pathParts = imageName1?.split("/");
      // setCurrImageName(pathParts[pathParts.length - 1]);
      setCurrentTaskData((prevData) => {
        if (direction === "next") {
          return {
            ...prevData,
            currentIndex: parseInt(prevData.currentIndex) + 1,
          };
        } else if (direction === "prev") {
          return {
            ...prevData,
            currentIndex: parseInt(prevData.currentIndex) - 1,
          };
        } else {
          return prevData;
        }
      });
      setSelectedCoordinates(false);
      if (imageRef.current) {
        imageRef.current.style.transform = "none";
        imageRef.current.style.transformOrigin = "initial";
      }
      setModifiedKeys(null);
      setZoomLevel(1);
      // setImageUrls(response.data.arrayOfImages);
      setImageNotFound(true);
      setPopUp(false);
    } catch (error) {
      console.log(error);
      toast.error("Image not found!.");
      setImageNotFound(false);
    }
  };


  const changeCurrentCsvDataHandler = (key, newValue) => {
    if (!imageNotFound) {
      return;
    }

    // Ensure csvCurrentData and key are valid
    if (!csvCurrentData || !key) {
      console.error("Invalid data or key.");
      return;
    }

    // Capture the matched value for the current key
    const csvDataKeys = Object.keys(csvData[0] || {});
    let matchedValue = null;

    for (const dataKey of csvDataKeys) {
      if (dataKey === key) {
        matchedValue = csvData[0][key];
        break;
      }
    }

    const matchedCoordinate = templateHeaders?.templetedata?.find(
      (data) => data.attribute === matchedValue
    );

    setCsvCurrentData((prevData) => {
      const previousValue = prevData[key];
      const trimmedValue = newValue.trim(); // Trim leading/trailing spaces

      if (matchedCoordinate?.fieldType === "questionsField") {
        if (templateHeaders?.isPermittedToEdit) {
          const validCharacters = templateHeaders?.typeOption?.split("-");
          if (validCharacters.includes(trimmedValue) || trimmedValue === "") {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [trimmedValue, csvData[currentIndex][key]],
            }));
            return {
              ...prevData,
              [key]: trimmedValue,
            };
          } else {
            return prevData;
          }
        } else {
          toast.warning("You do not have permission to edit this field.");
          return prevData;
        }
      } else {
        const formData = templateHeaders?.templetedata?.filter(
          (data) => data.fieldType === "formField"
        );

        const currentFormData = formData.find(
          (data) => data.attribute === csvData[0]?.[key]
        );

        if (!currentFormData) {
          return prevData; // No corresponding form data
        }

        const { dataFieldType, fieldLength } = currentFormData;
        const maxLength = parseInt(fieldLength, 10);

        if (dataFieldType === "number") {
          if (!/^\d*$/.test(trimmedValue)) {
            toast.error("Invalid number format.");
            return prevData;
          } else if (trimmedValue.length > maxLength) {
            toast.error(`Number exceeds maximum length of ${maxLength}.`);
            return prevData;
          } else {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [trimmedValue, csvData[currentIndex][key]],
            }));
            return {
              ...prevData,
              [key]: trimmedValue,
            };
          }
        } else if (dataFieldType === "text") {
          const filteredValue = newValue.replace(/[^A-Za-z\s]/g, "");

          if (newValue.length < previousValue.length) {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [newValue, csvData[currentIndex][key]],
            }));
            return {
              ...prevData,
              [key]: newValue,
            };
          } else if (newValue !== filteredValue) {
            toast.error("Text contains invalid characters.");
            return prevData;
          } else if (filteredValue.length >= maxLength) {
            toast.error(`Text exceeds maximum length of ${maxLength}.`);
            return prevData;
          } else {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [newValue, csvData[currentIndex][key]],
            }));
            return {
              ...prevData,
              [key]: newValue,
            };
          }
        } else if (dataFieldType === "alphanumeric") {
          if (
            newValue.length > maxLength ||
            !/^[a-zA-Z0-9\s]+$/.test(newValue)
          ) {
            toast.error("Invalid alphanumeric format.");
            return prevData;
          } else {
            setModifiedKeys((prevKeys) => ({
              ...prevKeys,
              [key]: [newValue, csvData[currentIndex][key]],
            }));
            return {
              ...prevData,
              [key]: newValue,
            };
          }
        }

        return prevData; // Handle other field types or return unchanged
      }
    });
  };

  const imageFocusHandler = (headerName) => {
    const csvDataKeys = Object.keys(csvData[0]);
    let matchedValue = null;

    for (const key of csvDataKeys) {
      if (key === headerName) {
        matchedValue = csvData[0][key];
        break;
      }
    }
    const matchedCoordinate = templateHeaders?.templetedata?.find(
      (data) => data.attribute === matchedValue
    );

    if (matchedCoordinate) {
      setCurrentImageIndex(matchedCoordinate.pageNo);
    }

    if (!imageNotFound) {
      return;
    }

    if (!imageUrls || !imageContainerRef || !imageRef) {
      setPopUp(true);
    }

    if (!csvData[0].hasOwnProperty(headerName)) {
      toast.error("Header not found: " + headerName);
      return;
    }

    const metaDataEntry = templateHeaders.templetedata.find(
      (entry) => entry.attribute === csvData[0][headerName]
    );

    if (!metaDataEntry) {
      toast.warning("Metadata entry not found for " + headerName);
      return;
    }

    const { coordinateX, coordinateY, width, height } = metaDataEntry;

    const containerWidth = imageContainerRef?.current?.offsetWidth;
    const containerHeight = imageContainerRef?.current?.offsetHeight;

    // Calculate the zoom level based on the container size and the selected area size
    const zoomLevel = Math.min(
      containerWidth / width,
      containerHeight / height
    );

    // Calculate the scroll position to center the selected area
    const scrollX =
      coordinateX * zoomLevel - containerWidth / 2 + (width / 2) * zoomLevel;
    const scrollY =
      coordinateY * zoomLevel - containerHeight / 2 + (height / 2) * zoomLevel;

    // Update the img element's style property to apply the zoom transformation
    imageRef.current.style.transform = `scale(${zoomLevel})`;
    imageRef.current.style.transformOrigin = `0 0`;

    // Scroll to the calculated position
    imageContainerRef.current.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: "smooth",
    });
    setSelectedCoordinates(true);
  };

  const onTaskStartHandler = async (taskData) => {
    try {
      const response = await axios.post(
        `http://${REACT_APP_IP}:4000/get/csvdata`,
        { taskData: taskData },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data.length === 1) {
        toast.warning("No matching data was found.");
        return;
      }

      setCsvData(response.data);
      let matchingIndex;
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i]["rowIndex"] == taskData.currentIndex) {
          matchingIndex = i;
          break;
        }
      }

      if (matchingIndex === undefined || matchingIndex === 0) {
        matchingIndex = 1;
      }
      setCurrentIndex(matchingIndex);
      onImageHandler("initial", matchingIndex, response.data, taskData);
      setPopUp(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  const onCompareTaskStartHandler = (taskdata) => {
    localStorage.setItem("taskdata", JSON.stringify(taskdata));
    navigate("/datamatching/correct_compare_csv", { state: taskdata });
  };

  const onCompleteHandler = async () => {
    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/taskupdation/${parseInt(
          currentTaskData?.id
        )}`,
        {
          taskStatus: true,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      setPopUp(true);
      setConfirmationModal(false);
      toast.success("task complted successfully.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const zoomInHandler = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel * 1.1, 3));
    setSelectedCoordinates(true);
  };

  const zoomOutHandler = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel * 0.9, 0.5));
    setSelectedCoordinates(true);
  };

  const onInialImageHandler = () => {
    setZoomLevel(1);
    setSelectedCoordinates(false);
    if (imageRef.current) {
      imageRef.current.style.transform = "none";
      imageRef.current.style.transformOrigin = "initial";
    }
  };


  return (
    <>
      {(userRole === "Operator" || userRole === "Moderator") && (
        <div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-16">
            {popUp && (
              <>
                <UserTaskAssined
                  onCompareTaskStartHandler={onCompareTaskStartHandler}
                  allTasks={allTasks}
                  compareTask={compareTask}
                  onTaskStartHandler={onTaskStartHandler}
                  setCurrentTaskData={setCurrentTaskData}
                />
              </>
            )}
            {!popUp && (
              <div className=" flex flex-col lg:flex-row  bg-gradient-to-r from-blue-400 to-blue-600 dataEntry ">
                {/* LEFT SECTION */}
                <FormDataSection
                  csvCurrentData={csvCurrentData}
                  csvData={csvData}
                  templateHeaders={templateHeaders}
                  imageColName={imageColName}
                  currentFocusIndex={currentFocusIndex}
                  inputRefs={inputRefs}
                  handleKeyDownJump={handleKeyDownJump}
                  changeCurrentCsvDataHandler={changeCurrentCsvDataHandler}
                  imageFocusHandler={imageFocusHandler}
                />

                {/* RIGHT SECTION */}
                <div className="w-full lg:w-[80%] xl:w-10/12 matchingMain">
                  {imageUrls.length === 0 ? (
                    <div className="flex justify-center items-center ">
                      <div className="mt-10">
                        <ImageNotFound />

                        <h1 className="mt-8 text-2xl font-bold tracking-tight text-gray-700 sm:text-4xl">
                          Please Select Image...
                        </h1>

                        <p className="mt-4 text-gray-600 text-center">
                          We can't find that page!!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-col">
                      <div className="flex float-right gap-4 mt-2 mr-4 ">
                        <div className="">
                          {/* <button
                          onClick={() => setPopUp(true)}
                          className=" px-6 py-2 bg-blue-600 text-white rounded-3xl mx-2 hover:bg-blue-700"
                        >
                          Back
                        </button> */}
                          {/* <Button
                          onClick={onCsvUpdateHandler}
                          variant="contained"
                          color="info"
                        >
                          update
                        </Button> */}

                          {/* <button
                          className="px-6 py-2 bg-blue-600 text-white rounded-3xl mx-2 hover:bg-blue-700"
                          onClick={() =>
                            onImageHandler(
                              "prev",
                              currentIndex,
                              csvData,
                              currentTaskData
                            )
                          }
                          endIcon={<ArrowBackIosIcon />}
                        >
                          Prev
                        </button> */}

                          {/* <button
                          className="px-6 py-2 bg-blue-600 text-white rounded-3xl mx-2 hover:bg-blue-700"
                          onClick={() =>
                            onImageHandler(
                              "next",
                              currentIndex,
                              csvData,
                              currentTaskData
                            )
                          }
                          endIcon={<ArrowForwardIosIcon />}
                        >
                          Next
                        </button> */}
                          {currentIndex === csvData.length - 1 && (
                            <button
                              onClick={() => setConfirmationModal(true)}
                              className="px-4 py-2 bg-teal-600 mx-2 text-white rounded-3xl hover:bg-teal-700"
                            >
                              Task Completed
                            </button>
                          )}
                        </div>
                      </div>
                      <ButtonSection
                        currentIndex={currentIndex}
                        csvData={csvData}
                        zoomInHandler={zoomInHandler}
                        onInialImageHandler={onInialImageHandler}
                        zoomOutHandler={zoomOutHandler}
                        currentImageIndex={currentImageIndex}
                        imageUrls={imageUrls}
                      />

                      <ImageSection
                        imageContainerRef={imageContainerRef}
                        currentImageIndex={currentImageIndex}
                        imageUrls={imageUrls}
                        imageRef={imageRef}
                        zoomLevel={zoomLevel}
                        selectedCoordintes={selectedCoordintes}
                        templateHeaders={templateHeaders}
                      />
                      <QuestionsDataSection
                        csvCurrentData={csvCurrentData}
                        csvData={csvData}
                        templateHeaders={templateHeaders}
                        imageColName={imageColName}
                        currentFocusIndex={currentFocusIndex}
                        inputRefs={inputRefs}
                        handleKeyDownJump={handleKeyDownJump}
                        changeCurrentCsvDataHandler={
                          changeCurrentCsvDataHandler
                        }
                        imageFocusHandler={imageFocusHandler}
                      />
                    </div>
                  )}
                </div>

                {/* CONFIRMATION MODAL */}
                <ConfirmationModal
                  confirmationModal={confirmationModal}
                  onSubmitHandler={onCompleteHandler}
                  setConfirmationModal={setConfirmationModal}
                  heading={"Confirm Task Completion"}
                  message={
                    "Please confirm if you would like to mark this task as complete."
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
      {userRole === "Admin" && <AdminAssined />}
    </>
  );
};

export default DataMatching;
