import React, { Fragment, useEffect, useState } from "react";
import { onGetTaskHandler } from "../../../services/common";
import { useParams } from "react-router-dom";
import axios from "axios";
import { REACT_APP_IP } from "../../../services/common";
import { toast } from "react-toastify";
import TaskDetails from "./TaskDetails";
import UpdatedInfo from "./UpdatedInfo";
import UpdatedImage from "./UpdatedImage";

function UpdatedDetails() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allTasks, setAllTasks] = useState([]);
  const rowsPerPage = 5;
  const [updatedData, setUpdatedData] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [updatedImages, setUpdatedImages] = useState([]);
  const [openImageDetails, setImageDetails] = useState(null);
  let token = JSON.parse(localStorage.getItem("userData"));
  const { id } = useParams();



  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setIsVisible(true);
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userTasks = await onGetTaskHandler(id);
        setAllTasks(userTasks);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTasks();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const onBackGroundClickHandler = (e) => {
    if (e.target.id === "modalBackground") {
      handleClose();
    }
  };

  const onUpdatedDetailsHandler = async (taskData) => {
    try {
      const response = await axios.post(
        `http://${REACT_APP_IP}:4000/updated/details`,
        { taskData },
        {
          headers: {
            token: token,
          },
        }
      );
      setUpdatedData(response?.data);
      setIsVisible(false);
      setCurrentTask(taskData);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    }
  };

  const totalPages = Math.ceil(allTasks.length / rowsPerPage);
  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const selectedRows = allTasks?.slice(startIndex, startIndex + rowsPerPage);
    return selectedRows.map((taskData, index) => (
      <div key={taskData.id} className="flex  py-2 w-full">
        <div className="whitespace-nowrap w-[150px] px-4">
          <div className="text-md text-center">{index + 1}</div>
        </div>
        <div className="whitespace-nowrap w-[150px] px-4">
          <div className="text-md text-center font-semibold py-1 border-2">
            {taskData.min}
          </div>
        </div>
        <div className="whitespace-nowrap w-[150px] px-4">
          <div className="text-md text-center font-semibold py-1 border-2">
            {taskData.max}
          </div>
        </div>

        <div className="whitespace-nowrap w-[150px] px-4">
          <div className="text-md text-center font-semibold py-1 border-2">
            {taskData.moduleType}
          </div>
        </div>

        <div className="whitespace-nowrap w-[150px] px-4">
          <div className="text-md text-center">
            <span
              className={`inline-flex items-center justify-center rounded-full ${!taskData.taskStatus
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
                } px-2.5 py-0.5 `}
            >
              {!taskData.taskStatus ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="-ms-1 me-1.5 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="-ms-1 me-1.5 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <p className="whitespace-nowrap text-sm">
                {taskData.taskStatus
                  ? "Completed"
                  : "Pending"}
              </p>
            </span>
          </div>
        </div>
        <div className="whitespace-nowrap text-center w-[150px] px-4">
          <button
            className="rounded-3xl border border-indigo-500 bg-indigo-500 px-6 py-1 font-semibold text-white"
            onClick={() => onUpdatedDetailsHandler(taskData)}
          >
            Show
          </button>
        </div>
      </div>
    ));
  };

  const onVerifyDetailHandler = async () => {
    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/verify/updateddetails`,
        { updatedId: openImageDetails?.id },
        {
          headers: {
            token: token,
          },
        }
      );
      setUpdatedData((prev) => {
        const updatedIsVerified = [...prev.isVerified];
        updatedIsVerified[openImageDetails?.index] = true;

        return {
          ...prev,
          isVerified: updatedIsVerified,
        };
      });
      setImageDetails(null)
      setOpenImage(false);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-20">
      {isVisible ? (
        <TaskDetails
          onBackGroundClickHandler={onBackGroundClickHandler}
          renderTableRows={renderTableRows}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      ) : (
        <Fragment>
          <UpdatedInfo
            updatedData={updatedData}
            setOpenImage={setOpenImage}
            setUpdatedImages={setUpdatedImages}
            setImageDetails={setImageDetails}
            setIsVisible={setIsVisible}
          />
          <UpdatedImage
            setOpenImage={setOpenImage}
            openImage={openImage}
            updatedImages={updatedImages}
            setUpdatedImages={setUpdatedImages}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            openImageDetails={openImageDetails}
            onVerifyDetailHandler={onVerifyDetailHandler}
          />
        </Fragment>
      )}
    </div>
  );
}

export default UpdatedDetails;
