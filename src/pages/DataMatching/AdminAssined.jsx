import React, { useEffect, useState } from "react";
import {
  REACT_APP_IP,
  onGetAllTasksHandler,
  onGetTemplateHandler,
  onGetAllUsersHandler,
} from "../../services/common";
import axios from "axios";
import { toast } from "react-toastify";
import AdminMatchingTasks from "./AdminMatchingTasks";
import AdminCompareTasks from "./AdminCompareTasks";
import TaskEdit from "./TaskEdit";

const AdminAssined = () => {
  const [compareTask, setCompareTask] = useState([]);
  const [matchingTask, setMatchingTask] = useState([]);
  const token = JSON.parse(localStorage.getItem("userData"));
  const [taskEdit, setTaskEdit] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [taskEditId, setTaskEditId] = useState("");
  const [taskType, setTaskType] = useState("ALL")

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"));
        const response = await axios.get(
          `http://${REACT_APP_IP}:4000/assignedTasks`,
          {
            headers: {
              token: token,
            },
          }
        );
        const AssignedData = response.data.assignedData;

        // const verifiedUser = await onGetVerifiedUserHandler();
        // const tasks = await onGetTaskHandler(verifiedUser.user.id);
        // const templateData = await onGetTemplateHandler();

        // const uploadTask = AssignedData.filter((task) => {
        //   return task.TemplateType === "Data Entry";
        // });
        const comTask = AssignedData.filter((task) => {
          return task.TemplateType === "CSVCompare";
        });

        // const updatedCompareTasks = comTask.map((task) => {
        //   const matchedTemplate = templateData.find(
        //     (template) => template.id === parseInt(task.templeteId)
        //   );
        //   if (matchedTemplate) {
        //     return {
        //       ...task,
        //       templateName: matchedTemplate.name,
        //     };
        //   }
        //   return task;
        // });
        // const updatedTasks = uploadTask.map((task) => {
        //   const matchedTemplate = templateData.find(
        //     (template) => template.id === parseInt(task.templeteId)
        //   );
        //   if (matchedTemplate) {
        //     return {
        //       ...task,
        //       templateName: matchedTemplate.name,
        //     };
        //   }
        //   return task;
        // });
        // setAllTasks(updatedTasks);
        // setMatchingTask(uploadTask);
        setCompareTask(comTask);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const onFetchTasksData = async () => {
      try {
        const tasks = await onGetAllTasksHandler();
        const templateData = await onGetTemplateHandler();
        const users = await onGetAllUsersHandler();
        setAllUsers(users.users);
        const uploadTask = tasks.filter(
          (task) => task.moduleType === "Data Entry"
        );

        const updatedTasks = uploadTask.map((task) => {
          const matchedTemplate = templateData.find(
            (template) => template.id === parseInt(task.templeteId)
          );

          const matchedUser = users.users.find(
            (user) => user.id === parseInt(task.userId)
          );

          // Create a new task object with existing task properties
          const updatedTask = { ...task };

          // Add userName if matchedUser is found
          if (matchedUser) {
            updatedTask.userName = matchedUser.userName;
          }

          // Add templateName if matchedTemplate is found
          if (matchedTemplate) {
            updatedTask.templateName = matchedTemplate.name;
          }

          // Return the updated task
          return updatedTask;
        });

        setMatchingTask(updatedTasks);
      } catch (error) {
        console.error("Error fetching tasks data:", error);
      }
    };

    onFetchTasksData();
  }, []);

  const convertToCsv = (jsonData) => {
    const headers = Object.keys(jsonData[0]);
    const csvHeader = headers.join(",") + "\n";
    const csvData = jsonData
      .map((obj) => {
        return headers.map((key) => obj[key]).join(",");
      })
      .join("\n");
    return csvHeader + csvData;
  };
  const onCompareTaskStartHandler = (taskData) => {
    const sendReq = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userData"));
        const response = await axios.get(
          `http://${REACT_APP_IP}:4000/download_error_file/${taskData.id}`,
          {
            headers: {
              token: token,
            },
            // responseType: "blob", // Set the response type to blob to receive binary data
          }
        );
        const jsonObj = response.data.csvFile;
        const csvData = convertToCsv(jsonObj);
        const blob = new Blob([csvData], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        const date = new Date().toJSON();
        link.download = `data_${date}.csv`;
        link.click();
        // Create a blob from the response data
        // const blob = new Blob([response.data], { type: "text/csv" });

        // // Create a temporary URL for the blob
        // const url = window.URL.createObjectURL(blob);

        // // Create a link element
        // const link = document.createElement("a");

        // // Set the href attribute of the link to the temporary URL
        // link.href = url;

        // // Set the download attribute to specify the file name
        // link.download = "error_file.csv";

        // // Append the link to the document body
        // document.body.appendChild(link);

        // // Programmatically click on the link to trigger the download
        // link.click();

        // // Remove the link from the document body after the download is initiated
        // document.body.removeChild(link);

        // Display the message
        // console.log(response.data.message); // or handle the message as required
      } catch (err) {
        console.log(err);
      }
    };
    sendReq();
    console.log(taskData);
  };

  const onDownloadHandler = async (currentTaskData) => {
    if (!currentTaskData.taskStatus) {
      toast.warning("The task is pending, so downloading is not available.");
      return;
    }

    try {
      const response = await fetch(
        `http://${REACT_APP_IP}:4000/download/csv/${currentTaskData.fileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Extract the filename from the response headers if provided
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "download.csv";
      if (
        contentDisposition &&
        contentDisposition.indexOf("attachment") !== -1
      ) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const onCompleteHandler = async (currentTask) => {
    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/taskupdation/${parseInt(currentTask.id)}`,
        { taskStatus: false },
        {
          headers: {
            token: token,
          },
        }
      );
      const updatedTasks = matchingTask.map((task) => {
        if (task.id === currentTask.id) {
          return { ...task, taskStatus: false };
        }
        return task;
      });

      setMatchingTask(updatedTasks);
      toast.success("Task status updated.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onEditTaskHandler = async (user) => {
    if (!user) {
      toast.warning("Please select the user.");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("userData"));
      await axios.post(
        `http://${REACT_APP_IP}:4000/edit/assigned/task`,
        { assignedTaskId: taskEditId, userId: user.id },
        {
          headers: {
            token: token,
          },
        }
      );

      const updatedTasks = matchingTask.map((task) => {
        if (task.id == taskEditId) {
          const taskData = {
            ...task,
            userName: user.userName,
          };
          return taskData;
        }
        return task;
      });

      setMatchingTask(updatedTasks);
      toast.success("Task updated successfully.");
      setTaskEditId("");
      setTaskEdit(false);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="h-[100vh] flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 templatemapping pt-20">
      <div className="">
        {/* MAIN SECTION  */}
        <section className=" lg:mx-auto max-w-6xl px-8 py-10 bg-white rounded-xl w-[100vw]">
          <div>
            <div>
              <h2 className="text-3xl font-semibold">Assigned Tasks</h2>
            </div>

            <div>
              <div className="hidden sm:block mt-4">
                <nav className="flex gap-6" aria-label="Tabs">
                  <button
                    onClick={() => setTaskType("All")}
                    className={`shrink-0 rounded-lg p-2 text-sm border-2 font-medium ${taskType === "All" && "bg-sky-100 text-sky-600"} hover:bg-sky-100 hover:text-gray-700`}
                  >
                    ALL TASKS
                  </button>

                  <button
                    onClick={() => setTaskType("completed")}
                    className={`shrink-0 rounded-lg p-2 text-sm border-2  font-medium ${taskType === "completed" && "bg-sky-100 text-sky-600"} hover:bg-sky-100 hover:text-gray-700`}
                  >
                    COMPLETED
                  </button>

                  <button
                    onClick={() => setTaskType("pending")}
                    className={`shrink-0 rounded-lg border-2  ${taskType === "pending" && "bg-sky-100 text-sky-600"} p-2 text-sm font-medium hover:bg-sky-100`}
                    aria-current="page"
                  >
                    PENDING
                  </button>
                </nav>
              </div>
            </div>

          </div>
          <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto  sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                  <div className="min-w-full divide-y divide-gray-200">
                    <div className="bg-gray-50">
                      <div className="flex justify-center">
                        <div className="py-3 text text-center font-semibold text-gray-700 w-[100px]">
                          Template
                        </div>
                        <div className="py-3 text-center text font-semibold text-gray-700 w-[100px]">
                          Assignee.
                        </div>
                        <div className="py-3 text-center text font-semibold text-gray-700 w-[100px]">
                          Min
                        </div>
                        <div className="py-3 text-center text font-semibold text-gray-700 w-[100px]">
                          Max
                        </div>
                        <div className="py-3 text-center text font-semibold text-gray-700 w-[100px]">
                          Module Type
                        </div>
                        <div className="py-3 text-center text font-semibold text-gray-700 w-[100px]">
                          Status
                        </div>
                        <div className="py-3 text-center text font-semibold text-gray-700 w-[100px]">
                          Re-Assign
                        </div>
                        <div className="py-3 text-center text font-semibold text-gray-700 w-[100px]">
                          Download
                        </div>
                        <div className="py-3 text-center text font-semibold text-gray-700 w-[100px]">
                          Edit
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 bg-white overflow-y-auto h-[250px] ">
                      <AdminCompareTasks
                        compareTask={compareTask}
                        onCompareTaskStartHandler={onCompareTaskStartHandler}
                      />
                      <AdminMatchingTasks
                        onCompleteHandler={onCompleteHandler}
                        setTaskEdit={setTaskEdit}
                        matchingTask={matchingTask}
                        onDownloadHandler={onDownloadHandler}
                        setTaskEditId={setTaskEditId}
                        taskType={taskType}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TaskEdit
            taskEdit={taskEdit}
            setTaskEdit={setTaskEdit}
            allUsers={allUsers}
            onEditTaskHandler={onEditTaskHandler}
          />
        </section>
      </div>
    </div>
  );
};

export default AdminAssined;
