import React, { useContext, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/image.png";
import dataContext from "../../Store/DataContext";
import { REACT_APP_IP } from "../../services/common";
// import loginImage from "../../assets/images/file.png";

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const dataCtx = useContext(dataContext);

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://${REACT_APP_IP}:4000/users/login`,
        values
      );

      if (response.status === 200) {
        localStorage.setItem("userData", JSON.stringify(response.data.token));
        dataCtx?.modifyIslogin(true);
        dataCtx?.modifyLoginData(response.data);
        toast.success("Login Successfull", {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      } else {
        toast.error("Login failed: Try Again!!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Login request failed:", error?.message);
      toast.error(error?.response?.data?.error, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <section className="flex justify-center items-center w-full h-[100vh] ">
      <div className=" px-4 py-10 max-w-6xl  bg-white rounded-3xl border-none shadow flex-col justify-center shadow-slate-300">
        <div className=" flex justify-center mb-8">
          <img className="h-24 w-auto" src={logo} alt="Your Company" />
        </div>{" "}
        {/* <div className="flex flex-row ">  */}
        {/* <div className="w-1/2">
            <img className="w-full h-[25rem]" src={loginImage} alt="" />
          </div> */}
        <div className="xl:mx-auto px-6 lg:px-20">
          {/* <div className="mt-16 mb-8 flex justify-center">
            <img className="h-20 w-auto" src={logo} alt="Your Company" />
          </div> */}
          <h2 className="text-center text-3xl font-bold leading-tight text-black">
            Sign in to your account
          </h2>

          <form
            action="#"
            method="POST"
            className="mt-5"
            onSubmit={handleSubmit}
          >
            <div className="">
              <div className="my-4">
                <label
                  htmlFor="email"
                  className="text-lg ps-4 font-medium text-blue-600"
                >
                  {" "}
                  Email address{" "}
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    className="flex h-10 w-full shadow-blue-200 shadow-md rounded-3xl border border-gray-300 bg-transparent px-4 py-2 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    onChange={handleInput}
                  ></input>
                </div>
              </div>
              <div className="my-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-lg ps-4 font-medium text-blue-600"
                  >
                    {" "}
                    Password{" "}
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    className="flex h-10 w-full shadow-blue-200 shadow-md  rounded-3xl border border-gray-300 bg-transparent px-4 py-2 text-md placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    required
                    name="password"
                    placeholder="Password"
                    onChange={handleInput}
                  ></input>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center mt-3 justify-center mb-4 hover:shadow-indigo-200 hover:shadow-md  rounded-3xl bg-blue-600 px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-indigo-600"
                >
                  Sign In <FaArrowRight className="ml-4 " size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* </div> */}
      </div>
    </section>
  );
}
