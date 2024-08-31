import { FaArrowLeft } from "react-icons/fa6";
import React from "react";
import { useNavigate } from "react-router-dom";

export function PageNotFound(props) {
  const navigate = useNavigate();
  const { errorMessage, errorCode } = props;
  const handleBackButton = () => {
    if(errorMessage !=="Page Not Found"){
        console.log("jhgj");
        navigate("/")
    }else{
        console.log("ioi");
        // navigate("/home");
    }
    
  };

  return (
    <div className="pt-40">
      <div className="text-center pt-40">
        <p className="text-3xl  font-bold text-black">{errorCode}</p>
        <h1 className="mt-2 text-3xl font-bold  text-black sm:text-5xl">
          {errorMessage}
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-4 flex items-center justify-center gap-x-3">
          <button
            type="button"
            onClick={handleBackButton}
            className="inline-flex items-center rounded-md bg-indigo-600  px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <FaArrowLeft size={16} className="mr-2" />
            Go to HomePage
          </button>
        </div>
      </div>
    </div>
  );
}
