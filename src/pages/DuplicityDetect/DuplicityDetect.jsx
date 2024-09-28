import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageNotFound from "../../components/ImageNotFound/ImageNotFound";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { REACT_APP_IP } from "../../services/common";
import FindDuplicate from "./FindDuplicate";
import DuplicatesData from "./DuplicateData";
import EditDuplicateData from "./EditDuplicateData";
import DuplicateImage from "./DuplicateImage";

const ImageScanner = () => {
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [duplicatesData, setDuplicatesData] = useState([]);
  const [showDuplicates, setShowDuplicates] = useState(true);
  const [showDuplicateField, setShowDuplicateField] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [allCurrentData, setAllCurrentData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [modifiedKeys, setModifiedKeys] = useState({});
  const token = JSON.parse(localStorage.getItem("userData"));
  let { fileId } = JSON.parse(localStorage.getItem("fileId")) || "";
  let imageNames = JSON.parse(localStorage.getItem("imageName")) || "";
  const { id } = useParams();
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://${REACT_APP_IP}:4000/get/headerdata/${fileId}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setCsvHeaders(response.data.headers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [fileId, token]);

  const onUpdateCurrentDataHandler = async () => {
    if (!modifiedKeys) {
      toast.success("Row updated successfully.");
      return;
    }

    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/update/duplicatedata`,
        {
          index: currentRowData?.index,
          fileID: fileId,
          rowData: currentRowData.row,
          updatedColumn: modifiedKeys,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      const indexToUpdate = duplicatesData.findIndex((group) =>
        group.sameData.some((item) => item.index === currentRowData.index)
      );
      if (indexToUpdate !== -1) {
        const updatedDuplicateData = duplicatesData.map((group, index) => {
          if (index === indexToUpdate) {
            return {
              sameData: group.sameData.map((item) =>
                item.index === currentRowData.index
                  ? { ...item, row: currentRowData.row }
                  : item
              ),
            };
          }
          return group;
        });

        const updatedAllCurrentData = allCurrentData.map((item) =>
          item.index === currentRowData.index
            ? { ...item, row: currentRowData.row }
            : item
        );

        const filteredUpdatedDuplicateData = updatedDuplicateData
          .map((group) => ({
            sameData: group.sameData.filter(
              (item) => item.row[columnName] !== currentRowData.row[columnName]
            ),
          }))
          .filter((group) => group.sameData.length > 0);

        const filteredAllCurrentData = updatedAllCurrentData.filter(
          (item) => item.row[columnName] !== currentRowData.row[columnName]
        );
        if (filteredUpdatedDuplicateData.length !== 0) {
          setDuplicatesData(filteredUpdatedDuplicateData);
        } else {
          setDuplicatesData(updatedDuplicateData);
        }
        if (filteredAllCurrentData.length !== 0) {
          setAllCurrentData(filteredAllCurrentData);
        } else {
          setAllCurrentData(updatedAllCurrentData);
        }
        setModifiedKeys(null);
      }
      toast.success("The row has been updated successfully.");
      setEditModal(false);
    } catch (error) {
      toast.error("Unable to update the row data!");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
        setImageUrl(currentRowData.imagePaths[currentImageIndex - 1]);
      } else if (
        event.key === "ArrowRight" &&
        currentImageIndex < currentRowData?.imagePaths.length - 1
      ) {
        setCurrentImageIndex(currentImageIndex + 1);
        setImageUrl(currentRowData.imagePaths[currentImageIndex + 1]);
      } else if (event.altKey && event.key === "s") {
        // Ensure currentRowData is not null before updating
        if (currentRowData) {
          onUpdateCurrentDataHandler();
        } else {
          console.error("currentRowData is null when trying to update.");
        }
      } else if (event.ctrlKey && event.key === "ArrowLeft") {
        if (editModal) {
          setEditModal(false);
        } else if (!showDuplicates) {
          setShowDuplicates(true);
        }
        setShowDuplicateField(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentImageIndex, currentRowData, onUpdateCurrentDataHandler]);

  const changeCurrentCsvDataHandler = (key, newValue) => {
    setCurrentRowData((prevData) => {
      const previousValue = prevData.row[key];

      // Set the modified keys with both new and previous values
      setModifiedKeys((prevKeys) => ({
        ...prevKeys,
        [key]: [newValue, previousValue],
      }));

      return {
        ...prevData,
        row: {
          ...prevData.row,
          [key]: newValue,
        },
      };
    });
  };

  const onFindDuplicatesHandler = async (columnName) => {
    try {
      const response = await axios.post(
        `http://${REACT_APP_IP}:4000/duplicate/data`,
        {
          colName: columnName,
          fileID: fileId,
          imageColumnName: imageNames,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data?.message) {
        toast.success(response.data?.message);
        return;
      }

      let groups = response.data.duplicates.reduce((acc, obj) => {
        let key = obj.row[columnName];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});

      let result = Object.values(groups).map((value) => {
        return { sameData: value };
      });

      setDuplicatesData(result);
      // setDuplicatesData(response.data.duplicates);
      const url = response.data?.duplicates[0].imagePaths[currentImageIndex];
      setCurrentRowData(response.data?.duplicates[0]);
      setImageUrl(url);
      setColumnName(columnName);
      setShowDuplicates(false);
      toast.success("Successfully fetched all duplicates data!");
    } catch (error) {
      console.log(error);
      toast.warning(error.response?.data?.message);
    }
  };



  const onRemoveDuplicateHandler = async (index, rowIndex, colName) => {
    const currentData = [...allCurrentData];
    const allDuplicateData = [...duplicatesData];

    const filteredData = currentData.filter((item) => item.index !== rowIndex);

    function removeItemByRowIndex(dataArray, rowIndex) {
      return dataArray
        .map((group) => {
          return {
            sameData: group.sameData.filter((item) => item.index !== rowIndex),
          };
        })
        .filter((group) => group.sameData.length > 0);
    }
    const updatedData = removeItemByRowIndex(allDuplicateData, rowIndex);

    if (currentData.length === 1) {
      toast.warning("Removing the row is not permitted.");
      return;
    }

    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/delete/duplicate`,
        { index: parseInt(rowIndex), fileID: fileId },
        {
          headers: {
            token: token,
          },
        }
      );

      filteredData.forEach((data) => {
        if (data.index > rowIndex) {
          data.index -= 1;
        }
      });
      setAllCurrentData(filteredData);
      setDuplicatesData(updatedData);
      toast.success("Row Deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const onEditModalHandler = (data, index) => {
    setCurrentRowData(data);
    setEditModal(true);
    setImageUrl(allCurrentData[index].imagePaths[currentImageIndex]);
  };
  const onShowModalHandler = (data) => {
    setAllCurrentData(data.sameData);
    setShowDuplicateField(true);
  };

  const onDuplicateCheckedHandler = () => {
    navigate(`/csvuploader/templatemap/${id}`);
  };

  return (
    <div className="flex duplicateImg  bg-gradient-to-r from-blue-400 to-blue-600 border-1 justify-center items-center   ">
      {showDuplicates ? (
        <FindDuplicate
          onDuplicateCheckedHandler={onDuplicateCheckedHandler}
          csvHeaders={csvHeaders}
          imageNames={imageNames}
          onFindDuplicatesHandler={onFindDuplicatesHandler}
        />
      ) : (
        <div className="flex flex-col w-full justify-center items-center lg:items-start lg:flex-row pt-20  ">
          {/* LEFT SECTION  */}
          <div className="flex w-full my-2 lg:my-7 lg:w-[30%] xl:w-[25%] ">
            <div className="text-center sm:block sm:p-0 w-full">
              {!editModal ? (
                <DuplicatesData
                  duplicatesData={duplicatesData}
                  columnName={columnName}
                  onShowModalHandler={onShowModalHandler}
                  showDuplicateField={showDuplicateField}
                  cancelButtonRef={cancelButtonRef}
                  setShowDuplicateField={setShowDuplicateField}
                  allCurrentData={allCurrentData}
                  onEditModalHandler={onEditModalHandler}
                  onRemoveDuplicateHandler={onRemoveDuplicateHandler}
                />
              ) : (
                <EditDuplicateData
                  currentRowData={currentRowData}
                  imageNames={imageNames}
                  changeCurrentCsvDataHandler={changeCurrentCsvDataHandler}
                  setEditModal={setEditModal}
                  onUpdateCurrentDataHandler={onUpdateCurrentDataHandler}
                />
              )}
            </div>
          </div>

          {/* RIGHT SECTION  */}
          {!imageUrl ? (
            <div className="flex lg:w-[70%] xl:w-[75%] justify-center items-center ">
              <div className="">
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
            <div className="w-[75%]">
              <DuplicateImage
                currentImageIndex={currentImageIndex}
                currentRowData={currentRowData}
                imageUrl={imageUrl}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageScanner;
