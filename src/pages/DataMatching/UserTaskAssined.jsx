import React, { useState } from "react";
import { toast } from "react-toastify";

const UserTaskAssined = ({
  onCompareTaskStartHandler,
  allTasks,
  compareTask,
  onTaskStartHandler,
  setCurrentTaskData,
}) => {
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [taskType, setTaskType] = useState("ALL")

  const handleStartClick = (taskData) => {
    if (taskData?.taskStatus) {
      toast.warning("Task is already completed.");
      return;
    }

    setLoadingTaskId(taskData.id);
    onTaskStartHandler(taskData);
    setCurrentTaskData(taskData);
    setTimeout(() => setLoadingTaskId(null), 3000);
  };

  const filteredTasks = taskType === "ALL"
    ? allTasks
    : taskType === "pending"
      ? allTasks?.filter(task => task?.taskStatus === false)
      : taskType === "completed"
        ? allTasks?.filter(task => task?.taskStatus === true)
        : allTasks;



  return (
    <div className="h-[100vh] flex justify-center bg-gradient-to-r from-blue-400 to-blue-600 items-center templatemapping">
      <div className="">
        {/* MAIN SECTION  */}
        <section className="mx-auto max-w-4xl  px-12 py-10 bg-white rounded-xl w-[100vw]">
          <div className="flex flex-col space-y-4  md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-3xl font-semibold">Assigned Tasks</h2>
            </div>
            <div>
              <div>
                <div className="sm:hidden">
                  <label htmlFor="Tab" className="sr-only">Tab</label>
                  <select id="Tab" className="w-full rounded-md border-gray-200">
                    <option>Settings</option>
                    <option>Messages</option>
                    <option>Archive</option>
                    <option select>Notifications</option>
                  </select>
                </div>

                <div className="hidden sm:block mt-4">
                  <nav className="flex gap-6" aria-label="Tabs">
                    <button
                      onClick={() => setTaskType("All")}
                      className={`shrink-0 rounded-lg p-2 text-sm font-medium ${taskType === "All" && "bg-sky-100 text-sky-600"} hover:bg-sky-100 hover:text-gray-700`}
                    >
                      ALL TASKS
                    </button>

                    <button
                      onClick={() => setTaskType("completed")}
                      className={`shrink-0 rounded-lg p-2 text-sm font-medium ${taskType === "completed" && "bg-sky-100 text-sky-600"} hover:bg-sky-100 hover:text-gray-700`}
                    >
                      COMPLETED
                    </button>

                    <button
                      onClick={() => setTaskType("pending")}
                      className={`shrink-0 rounded-lg ${taskType === "pending" && "bg-sky-100 text-sky-600"} p-2 text-sm font-medium hover:bg-sky-100`}
                      aria-current="page"
                    >
                      PENDING
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block  py-2 align-middle md:px-6 ">
                <div className=" border border-gray-200 md:rounded-lg">
                  <div className="divide-y divide-gray-200 ">
                    <div className="bg-gray-50 w-full">
                      <div className="flex">
                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          <span>Templates</span>
                        </div>

                        <div className=" py-3.5 px-4 text-center  text-xl font-semibold text-gray-700 w-[100px]">
                          Min
                        </div>

                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[100px]">
                          Max
                        </div>
                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          Module
                        </div>
                        <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          Status
                        </div>
                        <div className=" px-4 py-3.5 text-center text-xl font-semibold text-gray-700 w-[150px]">
                          Start Task
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 bg-white overflow-y-auto max-h-[300px]">
                      {filteredTasks?.map((taskData) => (
                        <div key={taskData.id}>
                          <div className="flex  py-2 w-full">
                            <div className="whitespace-nowrap w-[150px] px-4">
                              <div className="text-md text-center">
                                {taskData.templateName}
                              </div>
                            </div>
                            <div className="whitespace-nowrap w-[100px] px-4">
                              <div className="text-md text-center">
                                {taskData.min}
                              </div>
                            </div>
                            <div className="whitespace-nowrap w-[100px] px-4">
                              <div className="text-md text-center">
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
                            <div
                              className="whitespace-nowrap text-center w-[150px] px-4"
                              key={taskData.id}
                            >
                              <button
                                onClick={() => handleStartClick(taskData)}
                                type="button"
                                disabled={loadingTaskId === taskData.id}
                                className={`rounded-3xl border border-indigo-500 bg-indigo-500 px-6 py-1 font-semibold text-white ${loadingTaskId === taskData.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                                  }`}
                              >
                                {loadingTaskId === taskData.id ? (
                                  <div className="flex items-center justify-center">
                                    <span className="mr-2">Loading...</span>
                                    <div className="animate-spin rounded-full border-b-2 border-white"></div>
                                  </div>
                                ) : (
                                  "Start"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {compareTask?.map((taskData, index) => (
                        <div
                          key={taskData.id}
                          className="grid grid-cols-7 gap-x-6 py-2"
                        >
                          <div className="whitespace-nowrap w-1/6">
                            <div className="text-md text-center">
                              {taskData.templateName}
                            </div>
                          </div>
                          <div className="whitespace-nowrap  w-1/6">
                            <div className="text-md text-center">
                              {taskData.min}
                            </div>
                          </div>
                          <div className="whitespace-nowrap w-1/6">
                            <div className="text-md text-center">
                              {taskData.max}
                            </div>
                          </div>

                          <div className="whitespace-nowrap w-1/6">
                            <div className="text-md text-center font-semibold py-1 border-2">
                              {taskData.moduleType}
                            </div>
                          </div>

                          <div className="whitespace-nowrap w-1/6">
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
                          <div className="whitespace-nowrap text-center w-1/6">
                            <button
                              onClick={() =>
                                onCompareTaskStartHandler(taskData)
                              }
                              className="rounded border border-indigo-500 bg-indigo-500 px-10 py-1 font-semibold text-white"
                            >
                              Start
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserTaskAssined;
