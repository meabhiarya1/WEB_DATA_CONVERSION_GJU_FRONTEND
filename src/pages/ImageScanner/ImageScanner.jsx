import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ImageNotFound from "../../components/ImageNotFound/ImageNotFound";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import dataContext from "../../Store/DataContext";
import { REACT_APP_IP } from "../../services/common";
import RemoveTemplate from "./RemoveTemplate";
import TemplateData from "./TemplateData";
import CoordinateData from "./CoordinateData";
import OptionData from "./OptionData";
import DynamicInput from "./DynamicInput";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import Permissions from "./Permissions";

const ImageScanner = () => {
  const [selection, setSelection] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [image, setImage] = useState(null);
  const [inputField, setInputField] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [removeModal, setRemoveModal] = useState(false);
  const [removeId, setRemoveId] = useState("");
  const [selectType, setSelectType] = useState("");
  const [inputCount, setInputCount] = useState(4);
  const [inputValues, setInputValues] = useState([]);
  const [lengthOfField, setLengthOfField] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [optionModel, setOptionModel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dataCtx = useContext(dataContext);
  const [selectedRow, setSelectedRow] = useState(null);
  const [templatePermissions, setTemplatePermissions] = useState({
    blankDefination: "",
    patternDefinition: "",
    isPermittedToEdit: false,
  });
  const [permissionModal, setPermissionModal] = useState(false);
  const [selectedCoordinateData, setSelectedCoordinateData] = useState(null);
  const [templateData, setTemplateData] = useState({
    name: "",
    pageCount: "",
  });
  const [questionRange, setQuestionRange] = useState({
    min: "",
    max: "",
  });

  const token = JSON.parse(localStorage.getItem("userData"));
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const imageURL = JSON.parse(localStorage.getItem("images"));
  const templateOption =
    JSON.parse(localStorage.getItem("templateOption")) || "creating";

  useEffect(() => {
    if (templateOption === "updating") {
      if (Object.keys(dataCtx.templateData).length === 0) {
        navigate("/csvuploader");
      } else {
        if (dataCtx.templateData) {
          const selectedCoordinatesData = dataCtx?.templateData?.metaData.map(
            (data, index) => {
              const newObj = {
                coordinateX: +data.coordinateX,
                coordinateY: +data.coordinateY,
                width: +data.width,
                height: +data.height,
                pageNo: data.pageNo,
                fieldType: data.fieldType,
                fId: index,
                attribute: data.attribute,
                fieldRange: data.fieldRange,
                fieldLength: data.fieldLength,
                dataFieldType: data.dataFieldType,
              };
              return newObj;
            }
          );
          setTemplateData((prevState) => ({
            ...prevState,
            name: dataCtx?.templateData?.templateData?.name,
            pageCount: dataCtx?.templateData?.templateData?.pageCount,
          }));
          setTemplatePermissions((prevState) => ({
            ...prevState,
            blankDefination:
              dataCtx?.templateData?.templateData?.blankDefination,
            patternDefinition:
              dataCtx?.templateData?.templateData?.patternDefinition,
            isPermittedToEdit:
              dataCtx?.templateData?.templateData?.isPermittedToEdit,
          }));
          setSelectedCoordinates(selectedCoordinatesData);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (imageURL && imageURL.length > 0) {
      setImage(imageURL[currentImageIndex]);
    }
  }, [currentImageIndex]);

  useEffect(() => {
    const handlekeyDown = (e) => {
      if (e.key === "ArrowRight") {
        onNextImageHandler();
      } else if (e.key === "ArrowLeft") {
        onPreviousImageHandler();
      }
    };
    window.addEventListener("keydown", handlekeyDown);
    return () => {
      window.removeEventListener("keydown", handlekeyDown);
    };
  }, []);

  const onNextImageHandler = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < imageURL.length - 1 ? prevIndex + 1 : prevIndex
    );
    setSelection(null);
  };

  const onPreviousImageHandler = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  // Function to handle mouse down event for drag selection
  const handleMouseDown = (e) => {
    const boundingRect = imageRef.current.getBoundingClientRect();
    const offsetX = e.clientX - boundingRect.left;
    const offsetY = e.clientY - boundingRect.top;
    setDragStart({ x: offsetX, y: offsetY });
  };
  // Function to handle mouse up event for drag selection
  const handleMouseUp = () => {
    if (dragStart) {
      setDragStart(null);
      setOpen(true);
    }
  };
  // Function to handle mouse move event for drag selection
  const handleMouseMove = (e) => {
    if (!e.buttons || !dragStart) {
      return;
    }
    const boundingRect = imageRef?.current.getBoundingClientRect();
    const offsetX = e.clientX - boundingRect.left;
    const offsetY = e.clientY - boundingRect.top;

    const container = imageRef.current.parentElement;
    if (offsetY > container.clientHeight - 100) {
      container.scrollTop += 100;
    }

    setSelection({
      coordinateX: Math.min(dragStart.x, offsetX),
      coordinateY: Math.min(dragStart.y, offsetY),
      width: Math.abs(offsetX - dragStart.x),
      height: Math.abs(offsetY - dragStart.y),
      pageNo: currentImageIndex,
    });
  };

  const onResetHandler = () => {
    setDragStart(null);
    setSelection(null);
    setQuestionRange({
      min: "",
      max: "",
    });
    setFieldType("");
    setLengthOfField("");
    setSelectType("");
    setInputField("");
    setOpen(false);
  };

  // Function to submit drag selection and name of options like -> Roll Number , or Subject
  const onSelectedHandler = () => {
    if (!fieldType) {
      toast.warning("Please select a field type.");
      return;
    }

    if (fieldType === "questionsField") {
      if (!questionRange || !questionRange.min || !questionRange.max) {
        toast.warning("Please ensure all fields are properly filled out.");
        return;
      }

      if (Number(questionRange.min) > Number(questionRange.max)) {
        toast.warning(
          "Ensure the minimum value is less than the maximum value."
        );
        return;
      }
    } else {
      if (fieldType === "formField" && inputField.includes("-")) {
        toast.warning("Please refrain from using hyphens (-) in this field.");
        return;
      }

      if (!inputField) {
        toast.warning("Please ensure to add the coordinate name.");
        return;
      }
      if (!selectType) {
        toast.warning("Please select the type field.");
        return;
      }

      if (selectType === "number") {
        if (!questionRange.min || !questionRange.max) {
          toast.warning("Please enter the range of the field.");
          return;
        }
        if (Number(questionRange.min) > Number(questionRange.max)) {
          toast.warning(
            "Ensure the minimum value is less than the maximum value."
          );
          return;
        }
      }
    }

    if (fieldType === "formField" && !lengthOfField) {
      toast.warning("Please enter the length of the field.");
      return;
    }

    const newObj = {
      ...selection,
      fieldType,
      fId: Math.random().toString(),
      attribute:
        fieldType === "formField"
          ? inputField
          : questionRange.min + "--" + questionRange.max,
      dataFieldType: selectType,
      fieldRange:
        selectType === "number"
          ? questionRange.min + "--" + questionRange.max
          : "0",
      fieldLength: fieldType === "formField" ? lengthOfField : 0,
    };

    if (selectedCoordinateData) {
      const updatedObj = {
        attribute:
          fieldType === "formField"
            ? inputField
            : questionRange.min + "--" + questionRange.max,
        coordinateX: selectedCoordinateData.coordinateX,
        coordinateY: selectedCoordinateData.coordinateY,
        dataFieldType: selectType,
        fId: selectedCoordinateData.fId,
        fieldLength: fieldType === "formField" ? lengthOfField : 0,
        fieldRange:
          selectType === "number"
            ? questionRange.min + "--" + questionRange.max
            : "0",
        fieldType: fieldType,
        height: selectedCoordinateData.height,
        pageNo: selectedCoordinateData.pageNo,
        width: selectedCoordinateData.width,
      };
      const updatedSelectedCoordinate = selectedCoordinates.map((data) => {
        if (data.fId === selectedCoordinateData.fId) {
          return updatedObj;
        }
        return data;
      });
      setSelectedCoordinates(updatedSelectedCoordinate);
    } else {
      setSelectedCoordinates((prev) => [...prev, newObj]);
    }
    console.log(selectType);
    setInputField("");
    setFieldType("");
    setLengthOfField("");
    setSelectType("");
    setQuestionRange({
      min: "",
      max: "",
    });
    console.log(selectType);

    setOpen(false);
    setSelectedCoordinateData(null);
    toast.success("Coordinate successfully added.");
  };

  const onRemoveSelectedHandler = () => {
    const newArray = selectedCoordinates.filter(
      (data) => data.fId !== removeId
    );
    setSelectedCoordinates(newArray);
    toast.success("Successfully deleted coordinate.");
    setRemoveId("");
    setRemoveModal(false);
    setSelection(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!templatePermissions.patternDefinition) {
      toast.error("Please select the pattern");
      return;
    }

    if (selectedCoordinates.length === 0) {
      toast.error("Please select the coordinates");
      return;
    }

    if (optionModel && !selectedRow) {
      toast.warning("Please select the field options.");
      return;
    }

    if (optionModel && inputValues.length <= 0) {
      toast.warning("Please create input boxes.");
      return;
    }

    let selectedValues = [];
    let characters = [];

    switch (selectedRow) {
      case "upper":
        characters = Array.from({ length: inputValues.length }, (_, index) =>
          String.fromCharCode(65 + index)
        );
        break;
      case "lower":
        characters = Array.from({ length: inputValues.length }, (_, index) =>
          String.fromCharCode(97 + index)
        );
        break;
      case "number":
        characters = Array.from({ length: inputValues.length }, (_, index) =>
          (index + 1).toString()
        );
        break;
      default:
        characters = inputValues.map((value, index) =>
          String.fromCharCode(65 + index)
        );
        break;
    }

    // Iterate through inputValues array
    inputValues.forEach((item, index) => {
      if (!item[selectedRow]) {
        selectedValues.push(characters[index]);
      } else {
        selectedValues.push(item[selectedRow]);
      }
    });

    let concatenatedString = selectedValues.join("-");
    if (!concatenatedString) {
      if (selectedRow === "upper") {
        concatenatedString = "A-B-C-D";
      } else if (selectedRow === "lower") {
        concatenatedString = "a-b-c-d";
      } else if (selectedRow === "number") {
        concatenatedString = "1-2-3-4";
      }
    }

    const data = {
      templateData: {
        name: templateData.name,
        pageCount: imageURL.length,
        typeOption: concatenatedString,
        patternDefinition: templatePermissions.patternDefinition,
        blankDefination: templatePermissions.blankDefination,
        isPermittedToEdit: templatePermissions.isPermittedToEdit,
      },
      templateId: dataCtx?.templateData?.templateData?.id
        ? dataCtx?.templateData?.templateData?.id
        : undefined,
      metaData: [...selectedCoordinates],
    };

    const formData = new FormData();

    // Convert data object to JSON string and append it
    formData.append("data", JSON.stringify(data));

    // Append the binary data of each image directly to FormData under the key "images"
    imageURL.forEach((imageData, index) => {
      const contentType = imageData.split(";")[0].split(":")[1];
      const blob = base64ToBlob(imageData.split(",")[1], contentType);
      const file = new File([blob], `image_${index}.${contentType}`, {
        type: contentType,
      });
      formData.append("images", file);
    });

    // Append the array of image files under the key "images"
    try {
      await axios.post(`http://${REACT_APP_IP}:4000/add/templete`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      toast.success("Template created & updated successfully!");
      dataCtx.modifyTemplateData(null);
      localStorage.removeItem("images");
      setTemplatePermissions((prevState) => ({
        ...prevState,
        blankDefination: "",
        patternDefinition: "",
        isPermittedToEdit: false,
      }));
      navigate("/imageuploader");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  function base64ToBlob(base64String, contentType) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  // OPTIONS INPUTS
  const handleInputChange = (e, type, index) => {
    const newInputValues = [...inputValues];
    const inputValue = e.target.value.trim();
    if (selectedRow === "upper") {
      // Allow only uppercase letters A-Z
      if (/^[A-Z]$/.test(inputValue)) {
        newInputValues[index][type] = inputValue;
      } else {
        newInputValues[index][type] = "";
      }
    } else if (selectedRow === "lower") {
      // Allow only lowercase letters a-z
      if (/^[a-z]$/.test(inputValue)) {
        newInputValues[index][type] = inputValue;
      } else {
        newInputValues[index][type] = "";
      }
    } else if (selectedRow === "number") {
      // Allow only digits 0-9
      if (/^\d+$/.test(inputValue)) {
        newInputValues[index][type] = inputValue;
      } else {
        newInputValues[index][type] = "";
      }
    } else {
      newInputValues[index][type] = inputValue;
    }

    setInputValues(newInputValues);
  };

  const handleCheckboxChange = (rowType) => {
    setSelectedRow(rowType === selectedRow ? null : rowType);
  };

  const handleCreateInputs = () => {
    const newInputValues = Array.from({ length: inputCount }).map((_, i) => ({
      upper: "",
      lower: "",
      number: "",
    }));
    setInputValues(newInputValues);
  };

  const createInputs = () => {
    return (
      <>
        <DynamicInput
          inputValues={inputValues}
          handleInputChange={handleInputChange}
          selectedRow={selectedRow}
          handleCheckboxChange={handleCheckboxChange}
        />
      </>
    );
  };

  const onEditCoordinateDataHanlder = (id) => {
    const selectedCoordinate = selectedCoordinates.find(
      (data) => data.fId === id
    );

    if (selectedCoordinate.fieldType === "formField") {
      setFieldType("formField");
      setSelectType(selectedCoordinate.dataFieldType);
      setLengthOfField(selectedCoordinate.fieldLength);
      setInputField(selectedCoordinate.attribute);
      console.log(selectType);

      if (selectedCoordinate.dataFieldType === "number") {
        const [min, max] = selectedCoordinate.fieldRange.split("--");
        setQuestionRange((prev) => ({
          ...prev,
          min: min,
          max: max,
        }));
      }
    } else if (selectedCoordinate.fieldType === "questionsField") {
      setFieldType("questionsField");
      const [min, max] = selectedCoordinate.attribute.split("--");
      setQuestionRange((prev) => ({
        ...prev,
        min: min,
        max: max,
      }));
    }
    setSelectedCoordinateData(selectedCoordinate);
    setOpen(true);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center items-center scannerbg bg-gradient-to-r from-blue-400 to-blue-600 border-1 pt-20 ">
      {/* LEFT SECTION  */}
      <div className="flex w-[40%] lg:w-[25%]">
        <div className="flex flex-1  flex-col justify-between">
          <TemplateData
            selectedCoordinates={selectedCoordinates}
            setRemoveModal={setRemoveModal}
            setRemoveId={setRemoveId}
            templateData={templateData}
            onEditCoordinateDataHanlder={onEditCoordinateDataHanlder}
            setTemplateData={setTemplateData}
            setOptionModel={setOptionModel}
            setConfirmationModal={setConfirmationModal}
            setPermissionModal={setPermissionModal}
            templatePermissions={templatePermissions}
          />
        </div>
      </div>

      {/* DELETE COMPONENT  */}
      <RemoveTemplate
        onRemoveSelectedHandler={onRemoveSelectedHandler}
        removeModal={removeModal}
        setRemoveModal={setRemoveModal}
      />

      {/* Confirmation template saving COMPONENT  */}
      <ConfirmationModal
        onSubmitHandler={onSubmitHandler}
        confirmationModal={confirmationModal}
        setConfirmationModal={setConfirmationModal}
        heading={"Template Submission Confirmation"}
        message={"Are you sure you want to submit the template?"}
      />

      <Permissions
        permissionModal={permissionModal}
        setPermissionModal={setPermissionModal}
        templatePermissions={templatePermissions}
        setTemplatePermissions={setTemplatePermissions}
      />

      {/* OPTION DATA MODEL AND FINAL SUBMIT */}
      <OptionData
        optionModel={optionModel}
        setOptionModel={setOptionModel}
        inputCount={inputCount}
        setInputCount={setInputCount}
        setInputValues={setInputValues}
        createInputs={createInputs}
        handleCreateInputs={handleCreateInputs}
        setConfirmationModal={setConfirmationModal}
        selectedRow={selectedRow}
      />

      {/* RIGHT SECTION  */}
      {!image ? (
        <div className="flex w-[75%] h-[100vh] justify-center items-center">
          <div>
            <ImageNotFound />
            <h1 className="mt-8 text-2xl font-bold tracking-tight text-gray-700 sm:text-4xl">
              Please Select an Image...
            </h1>
            <p className="mt-4 text-gray-600 text-center">
              We can't find that page!
            </p>
          </div>
        </div>
      ) : (
        <div className=" w-[75%]">
          <div className="mx-auto max-w-screen-xl px-2  sm:px-6 lg:px-8">
            <h1 className="text-center my-3  text-xl font-bold text-white">
              {currentImageIndex + 1} out of {imageURL.length}
            </h1>
            <div className="mb-3 flex justify-center">
              <div>
                {image && (
                  <div
                    style={{
                      position: "relative",
                      height: "50rem",
                    }}
                    className="w-full overflow-y-auto"
                  >
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Selected"
                      style={{
                        width: "48rem",
                        cursor: "crosshair",
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}
                      draggable={false}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    />

                    <>
                      {selectedCoordinates
                        .filter((data) => data.pageNo === currentImageIndex)
                        .map((data, index) => (
                          <div
                            key={index}
                            onDoubleClick={() =>
                              onEditCoordinateDataHanlder(data.fId)
                            }
                            style={{
                              border: "3px solid #007bff",
                              position: "absolute",
                              backgroundColor: "rgba(0, 123, 255, 0.2)",
                              left: data.coordinateX,
                              top: data.coordinateY,
                              width: data.width,
                              height: data.height,
                            }}
                          ></div>
                        ))}
                      {selection && (
                        <div
                          style={{
                            border: "3px solid #007bff",
                            backgroundColor: "rgba(0, 123, 255, 0.2)",
                            position: "absolute",
                            left: selection.coordinateX,
                            top: selection.coordinateY,
                            width: selection.width,
                            height: selection.height,
                          }}
                        ></div>
                      )}
                      <CoordinateData
                        onSelectedHandler={onSelectedHandler}
                        open={open}
                        setOpen={setOpen}
                        onResetHandler={onResetHandler}
                        fieldType={fieldType}
                        setFieldType={setFieldType}
                        setSelectType={setSelectType}
                        selectType={selectType}
                        questionRange={questionRange}
                        setQuestionRange={setQuestionRange}
                        lengthOfField={lengthOfField}
                        setLengthOfField={setLengthOfField}
                        inputField={inputField}
                        setInputField={setInputField}
                      />
                    </>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageScanner;
