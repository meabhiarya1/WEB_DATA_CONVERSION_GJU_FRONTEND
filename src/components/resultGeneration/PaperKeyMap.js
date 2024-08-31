import React, { useContext, useState } from "react";
import ResultGenerationContext from "../../Store/ResultGenerationContext";

const PaperkeyMap = () => {
  const ctx = useContext(ResultGenerationContext);
  const [selectedKeyOpen, setSelectedKeyOpen] = useState(false);
  const [mappedKey, setMappedKEy] = useState(null);
  const [mappedQue, setMappedQue] = useState(null);

  const keyHEaders = ctx.keyHeaders;
  const dataHeaders = ctx.dataHeaders;
  const selectedKEyOptionOpen = (mappedKeys) => {
    setSelectedKeyOpen(true);

    ctx.paperKeyHandler(mappedKeys);
  };
  return (
    <>
      {keyHEaders && dataHeaders && (
        <div className=" m-2 mt-5   ">
          <div className=" w-[100%]  animate__animated animate__backInDown animate__slow">
            {" "}
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 w-[100%] rounded-lg flex flex-col items-center py-4"
              onClick={(event) => {
                event.stopPropagation();
                // setSelectedKeyOpen(!selectedKeyOpen);
              }}
            >
              <div className="md:text-[1.2rem] text-[1.1rem] font-bold  text-yellow-400 mb-3">
                Select Mapped Key
              </div>
              <div
                className="border w-[90%] md:w-[80%] md:ms-2 flex flex-col items-center  py-1 text-white  cursor-pointer"
                onClick={() => setSelectedKeyOpen(!selectedKeyOpen)}
              >
                {!mappedKey ? (
                  <div
                    className="font-semibold "
                    onClick={() => setSelectedKeyOpen(!selectedKeyOpen)}
                  >
                    click here to select
                  </div>
                ) : (
                  <div
                    className={`font-semibold w-[100%] text-center ${selectedKeyOpen&&'border-b border-1 py-1'}`}
                    onClick={() => setSelectedKeyOpen(!selectedKeyOpen)}
                  >
                    {mappedKey}
                  </div>
                )}
                {selectedKeyOpen && (
                  <div className="md:w-[200px] h-[100px] overflow-y-scroll my-2 ">
                    {keyHEaders[0].map((currentKey) => (
                      <div
                        className="h-[30px] hover:bg-yellow-500 ps-3 hover:text-white flex flex-col justify-center"
                        key={currentKey}
                        onClick={(event) => {
                          // event.stopPropagation();
                          setMappedKEy(currentKey);
                          setSelectedKeyOpen(!selectedKeyOpen); // Close the dropdown after selecting the key
                          selectedKEyOptionOpen(currentKey);
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
        </div>
      )}
    </>
  );
};

export default PaperkeyMap;
