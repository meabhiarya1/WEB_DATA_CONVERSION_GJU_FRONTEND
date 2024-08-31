import React from "react";
import { MdOutlineRestartAlt } from "react-icons/md";
import { FaCloudDownloadAlt, FaRegEdit } from "react-icons/fa";

const AdminMatchingTasks = ({
  onCompleteHandler,
  matchingTask,
  onDownloadHandler,
  setTaskEdit,
  setTaskEditId,
}) => {
  return (
    <div>
      {matchingTask?.map((taskData) => (
        <div key={taskData.id} className="flex  justify-center">
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-center text-md ">{taskData.templateName}</div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-center text-md">{taskData.userName}</div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-md text-center">{taskData.min}</div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-md text-center">{taskData.max}</div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-md text-center border-2 ">
              {taskData.moduleType}
            </div>
          </div>
          <div className="whitespace-nowrap w-[100px] py-2">
            <div className="text-md text-center">
              <span
                className={`inline-flex items-center justify-center rounded-full ${
                  !taskData.taskStatus
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                } px-2.5 py-0.5`}
              >
                {!taskData.taskStatus ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="-ms-1 me-1.5 h-4 w-4 ml-2"
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
                    className="-ms-1 me-1.5 h-4 w-4  ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
          <div className="whitespace-nowrap text-center w-[100px] py-2">
            <button
              onClick={() => onCompleteHandler(taskData)}
              className={`rounded-3xl px-4 py-1 font-semibold ${
                taskData.taskStatus
                  ? "bg-indigo-500 text-white border border-indigo-500"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!taskData.taskStatus}
            >
              <MdOutlineRestartAlt />
            </button>
          </div>
          <div className="whitespace-nowrap text-center w-[100px] py-2">
            <button
              onClick={() => onDownloadHandler(taskData)}
              className={`rounded-3xl px-4 py-1 font-semibold ${
                taskData.taskStatus
                  ? "bg-indigo-500 text-white border border-indigo-500"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!taskData.taskStatus}
            >
              <FaCloudDownloadAlt />
            </button>
          </div>
          <div
            onClick={() => {
              setTaskEditId(taskData.id);
              setTaskEdit(true);
            }}
            className="whitespace-nowrap text-center w-[100px] py-2"
          >
            <button className="rounded border border-indigo-500 bg-indigo-500 px-4 py-1 font-semibold text-white">
              <FaRegEdit />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMatchingTasks;
