import React, { useContext, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import ResultGenerationContext from "../../Store/ResultGenerationContext";

const UploadStatus = () => {
  const ctx = useContext(ResultGenerationContext);

  const uploadFiles = ctx.uploadFiles;
  return (
    <>
      {" "}
      {uploadFiles.map((current) => (
        <div
          className="m-2 animate__animated animate__backInDown"
          key={current}
        >
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-[100%] h-[150px] flex flex-col md:flex-row items-center justify-center md:text-none  rounded-lg text-white font-bold text-[1.5rem] shadow-2xl shadow-grey-500">
            <div className="my-2">
              <FaRegCircleCheck className=" w-[60px] h-[60px] md:w-[80px] md:h-[80px] mx-2 mt-4" />
            </div>

            <div className="my-2 flex items-center justify-center  p-2  text-xl md:text-2xl w-[150px] h-[100px] break-all ">
              <p className="line-clamp-2 md:line-clamp-3 flex ">{current}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UploadStatus;
