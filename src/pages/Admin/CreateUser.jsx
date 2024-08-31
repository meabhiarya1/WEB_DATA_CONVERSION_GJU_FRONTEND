import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { REACT_APP_IP } from "../../services/common";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateUser = () => {
  const [userData, setUserData] = useState({
    userName: "",
    mobile: "",
    email: "",
    password: "",
    role: "",
    permissions: {
      dataEntry: false,
      comparecsv: false,
      csvuploader: false,
      createTemplate: false,
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setUserData({
        ...userData,
        permissions: {
          ...userData.permissions,
          [name]: checked,
        },
      });
    } else {
      if (name === "mobile") {
        // Allow only numbers
        const formattedValue = value.replace(/\D/g, "");
        setUserData({
          ...userData,
          [name]: formattedValue,
        });
      } else if (name === "role" && value === "Admin") {
        // If role is Admin, set all permissions to true
        setUserData({
          ...userData,
          [name]: value,
          permissions: {
            dataEntry: true,
            comparecsv: true,
            csvuploader: true,
            createTemplate: true,
          },
        });
      } else {
        setUserData({
          ...userData,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("userData"));
    if (
      !userData.role ||
      !userData.permissions ||
      !userData.userName ||
      !userData.mobile ||
      !userData.email ||
      !userData.password ||
      !confirmPassword
    ) {
      return toast.error("plzz select All fields", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }

    if (userData.password !== confirmPassword) {
      return toast.error("Password mismatch", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }

    const { permissions } = userData;
    const isAnyPermissionTrue = Object.values(permissions).some(
      (permission) => permission === true
    );

    if (!isAnyPermissionTrue) {
      return toast.error("Please select at least one permission", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/users/createuser`,
        { userData: userData },
        {
          headers: {
            token: token,
          },
        }
      );
      setUserData({
        userName: "",
        mobile: "",
        email: "",
        password: "",
        role: "",
        permissions: {
          dataEntry: false,
          comparecsv: false,
          csvuploader: false,
          createTemplate: false,
        },
      });
      setConfirmPassword("")
      toast.success("User Created successfully", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.response.data.error, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 h-fit pb-32">
      <div className="max-w-2xl mx-auto shadow-lg rounded-3xl py-4 px-16 bg-gray-50 mt-40 pb-12">
        <div className="mb-5">
          <h2 className="text-center text-3xl font-bold leading-tight text-gray my-4 ">
            Create a New User
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-10 w-full">
            <div className="w-full">
              <label htmlFor="userName" className="block text-lg font-medium ">
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="userName"
                required
                value={userData?.userName}
                placeholder="Enter Username"
                onChange={handleChange}
                className="mt-2  focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-2 shadow-md shadow-blue-100 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="w-full mt-4 sm:mt-0">
              <label htmlFor="mobile" className="block text-lg font-medium ">
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="text"
                autoComplete="mobile"
                placeholder="Enter Mobile no."
                maxLength={10}
                required
                value={userData?.mobile}
                onChange={handleChange}
                className="mt-2  focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-2 shadow-md shadow-blue-100 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="w-full">
            <label htmlFor="email" className="block text-lg font-medium ">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter Email ID"
              required
              value={userData?.email}
              onChange={handleChange}
              className="mt-2  px-4 py-2 shadow-md shadow-blue-100 focus:ring-indigo-500 focus:border-indigo-500 block w-full  sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-10 w-full">
            <div className="w-full mb-4">
              <label htmlFor="password" className="block text-lg font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  required
                  value={userData?.password}
                  onChange={handleChange}
                  className="mt-2 px-4 py-2 shadow-md shadow-blue-100 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <div className="w-full mt-4 sm:mt-0">
              <label
                htmlFor="confirmPassword"
                className="block text-lg font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 px-4 py-2 shadow-md shadow-blue-100 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-10 w-full">
            <div className="w-full mt-4  sm:mt-0">
              <label className="block text-lg font-medium">Role</label>
              <select
                id="role"
                name="role"
                required
                value={userData?.role}
                onChange={handleChange}
                className="mt-2 block w-full py-2 px-4 border  shadow-blue-100 bg-white rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option selected value="">
                  Select role
                </option>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="Operator">Operator</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium">Permissions</label>
            <div className="flex flex-wrap justify-start gap-x-14 w-full mt-2">
              <>
                <>
                  <div className="flex items-center w-full sm:w-auto">
                    <input
                      id="csvuploader"
                      name="csvuploader"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={userData.permissions.csvuploader}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="csvuploader"
                      className="ml-2 block text-md text-gray-900 font-semibold"
                    >
                      CSV Uploader
                    </label>
                  </div>

                  <div className="flex items-center w-full sm:w-auto">
                    <input
                      id="createTemplate"
                      name="createTemplate"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={userData.permissions.createTemplate}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="createTemplate"
                      className="ml-2 block text-md text-gray-900 font-semibold"
                    >
                      Create Template
                    </label>
                  </div>
                </>
              </>

              <div className="flex items-center w-full sm:w-auto">
                <input
                  id="dataEntry"
                  name="dataEntry"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={userData?.permissions?.dataEntry}
                  onChange={handleChange}
                />
                <label
                  htmlFor="dataEntry"
                  className="ml-2 block text-md text-gray-900 font-semibold"
                >
                  Data Entry
                </label>
              </div>

              <div className="flex items-center w-full sm:w-auto">
                <input
                  id="comparecsv"
                  name="comparecsv"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={userData?.permissions?.comparecsv}
                  onChange={handleChange}
                />
                <label
                  htmlFor="comparecsv"
                  className="ml-2 block text-md text-gray-900 font-semibold"
                >
                  CSV Merger
                </label>
              </div>

            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="mx-auto flex justify-center py-2 px-8 border border-transparent rounded-3xl shadow-md shadow-indigo-200 text-md font-medium text-white bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
