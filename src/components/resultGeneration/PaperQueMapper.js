import React, { useContext, useRef, useState } from "react";
import ResultGenerationContext from "../../Store/ResultGenerationContext";

const PaperQueMapper = () => {
  const [selectedQueOpen, setSelectedQueOpen] = useState(false);
  const [mappedQue, setMappedQue] = useState(-1);
  const totalQue = useRef();
  const ctx = useContext(ResultGenerationContext);
  const keyHEaders = ctx.keyHeaders;
  const dataHeaders = ctx.dataHeaders;
  return (
    <>
      {" "}
      {keyHEaders && dataHeaders && (
        <>
          <div className=" m-2 mt-5  animate__animated animate__backInDown animate__slower ">
            <div
              className=" w-[100%]   "
              onClick={() => {
                setSelectedQueOpen(false);
              }}
            >
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-[100%] rounded-lg flex flex-col items-center py-4">
                <div className="md:text-[1.2rem] text-[1.1rem] font-bold text-yellow-400 mb-3">
                  Start Question 
                </div>
                <div
                  className={`border w-[90%] md:w-[80%] md:ms-2 flex flex-col items-center  py-1 text-white  cursor-pointer`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedQueOpen(!selectedQueOpen); // open the dropdown after selecting the Question key
                  }}
                >
                  {mappedQue < 0 ? (
                    <div
                      className="font-semibold "
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedQueOpen(!selectedQueOpen); // open the dropdown after selecting the Question key
                      }}
                    >
                      click here to select
                    </div>
                  ) : (
                    <div
                      className={`font-semibold w-full text-center   ${
                        selectedQueOpen && "border-b border-1 py-1"
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedQueOpen(!selectedQueOpen); // open the dropdown after selecting the Question key
                      }}
                    >
                      {dataHeaders[0][mappedQue]}
                    </div>
                  )}
                  {selectedQueOpen && (
                    <div className="md:w-[200px] h-[100px] overflow-y-scroll my-2">
                      {keyHEaders[0].map((currentKey, index) => (
                        <div
                          className="h-[30px] hover:bg-yellow-500 ps-3 hover:text-white font-semibold flex flex-col justify-center"
                          key={currentKey}
                          onClick={(event) => {
                            event.stopPropagation();
                            setMappedQue(index);
                            // mappedQuesHandler(index);
                            setSelectedQueOpen(false); // Close the dropdown after selecting the key
                            ctx.paperMarkHandler({ start: index });
                          }}
                        >
                          {currentKey}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>{" "}
          <div className=" m-2 mt-5  animate__animated animate__backInDown animate__slower ">
            <div className=" w-[100%]   " onClick={() => {}}>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-[100%] rounded-lg flex flex-col items-center py-4 ">
                <div className="md:text-[1.2rem] text-[1.1rem] font-bold  text-yellow-400 mb-3">
                  Total Questions
                </div>
                <input
                  className="text-center font-bold w-[80%]  cursor-pointer"
                  ref={totalQue}
                  defaultValue={+100}
                  type="number"
                  min={0}
                  onBlur={() =>
                    ctx.paperMarkHandler({ end: +totalQue.current.value })
                  }
                ></input>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PaperQueMapper;
