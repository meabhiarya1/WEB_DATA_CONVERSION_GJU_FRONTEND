import React, { useContext, useState } from "react";
import ResultGenerationContext from "../../Store/ResultGenerationContext";
import GenerateResultCsv from "./GenerateResultCsv";

const OutPutHeaders = () => {
  const ctx = useContext(ResultGenerationContext);
  const dataHeaders = ctx.dataHeaders;
  const subjectMArking = ctx.subjectMarkings.length;
  const [selectAll, setSelectAll] = useState(false);
  const [headers, setHeaders] = useState([]);
  const outPutHeadersHandler = (data) => {
    // headers.push(data);
    const findHeader = headers.includes(data);

    if (findHeader) {
      // if header will be present then we will remove it
      const filteredHEaders = headers.filter((current) => current !== data);
      setHeaders(filteredHEaders);
    } else {
      setHeaders((prev) => [...prev, data]);
    }
  };
  const allOutputSelector = (dataArray) => {
    setSelectAll(true);
    setHeaders(dataArray);
  };
  const allOutPutDeselector = () => {
    setSelectAll(false);
    setHeaders([]);
  };
  return (
    //  {/* outputheaders */}
    <>
      {" "}
      <div className=" flex  h-[100%] mb-[5px] justify-center min-[1103px]:border-s-2 border-gray-400">
        <div className="mx-2 h-auto  min-w-[250px] w-[20vw] max-[1103px]:w-[600px]">
          <div className="animate__animated animate__bounceInDown animate__delay-3s">
            {" "}
            <div className=" w-[100%] bg-gradient-to-r from-red-600 to-yellow-500 shadow-lg flex justify-center text-2xl font-bold border-4  border-white my-4  shadow-gray-500">
              <p className="bg-grey py-4 text-white "> OutPut Headers</p>
            </div>
            <div>
              {" "}
              <div className=" flex justify-end bg-gradient-to-r from-cyan-500 to-blue-500 ">
                {!selectAll ? (
                  <div className="flex border-2 border-white font-bold p-1  bg-yellow-500">
                    <input
                      className="w-[20px] h-[20px] mx-2 border-2 border-blue-500"
                      type="checkbox"
                      onClick={() => {
                        allOutputSelector(dataHeaders[0]);
                      }}
                    ></input>
                    <p className="text-white">select all</p>
                  </div>
                ) : (
                  <div className="flex  border-2 border-gray-500 font-bold p-1  bg-yellow-500 text-white">
                    <input
                      className="w-[20px] h-[20px] mx-2 border-2 text-red-400"
                      type="checkbox"
                      checked
                      onClick={() => {
                        allOutPutDeselector([]);
                      }}
                    ></input>
                    <p>unSelectAll</p>
                  </div>
                )}
              </div>
              <div className="h-[400px] bg-gradient-to-r from-cyan-500 to-blue-500 border-2 overflow-y-scroll pb-[70px] shadow-lg shadow-gray-500">
                {" "}
                {dataHeaders &&
                  dataHeaders[0].map((current, index) => {
                    return (
                      <div
                        className="    hover:bg-yellow-500"
                        key={index}
                        onClick={() => outPutHeadersHandler(current)}
                      >
                        <input
                          type="checkbox"
                          id={current}
                          name={current}
                          checked={headers.includes(current)}
                          className="mx-2 h-[20px] w-[20px] my-2"
                        />
                        <label
                          htmlFor="scales"
                          className="mx-4 text-[1.1rem] font-bold text-white"
                        >
                          {current}
                        </label>
                        <hr className="mt-2"></hr>
                      </div>
                    );
                  })}
              </div>{" "}
            </div>
          </div>{" "}
          <GenerateResultCsv headers={headers}></GenerateResultCsv>
        </div>
      </div>
    </>
  );
};

export default OutPutHeaders;
