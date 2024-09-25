import axios from "axios";
import { toast } from "react-toastify";

// export const REACT_APP_IP = "192.168.0.106";
export const SERVER_IP = "http://192.168.1.39:4000";
export const REACT_APP_IP = "192.168.1.39";
// export const REACT_APP_IP = "localhos";
export const onGetTemplateHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.post(
      `http://${REACT_APP_IP}:4000/get/templetes`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const onGetAllUsersHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.post(
      `http://${REACT_APP_IP}:4000/users/getallusers`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const onGetVerifiedUserHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));
  if (!token) {
    return;
  }
  try {
    const response = await axios.post(
      `http://${REACT_APP_IP}:4000/users/getuser`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );

    return response.data;
  } catch (error) { }
};

export const onGetAllTasksHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.get(
      `http://${REACT_APP_IP}:4000/get/alltasks`,
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    // toast.error(error.message);
  }
};

export const onGetTaskHandler = async (id) => {
  const token = JSON.parse(localStorage.getItem("userData"));
  try {
    const response = await axios.get(
      `http://${REACT_APP_IP}:4000/get/task/${id}`,
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};
