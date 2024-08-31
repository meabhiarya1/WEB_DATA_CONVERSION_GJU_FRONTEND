import React, { useContext, useRef } from "react";
import ResultGenerationContext from "../../Store/ResultGenerationContext";

const MarksApply = () => {
  const ctx = useContext(ResultGenerationContext);
  const correctAnswerPoint = useRef(1);
  const wrongAnswerPoint = useRef(0);
  const handleCorrectPoints = (event) => {
    // console.log(correctAnswerPoint.current.value);
  };

  return (
    <div className="m-2 w-[100%] flex justify-center pe-4">
      <div className="animate__animated animate__zoomInDown animate__delay-2s w-[100%] max-w-[600px] h-fit bg-gradient-to-r from-red-600 to-yellow-500 pb-8 rounded-lg shadow-md shadow-gray-500" >
        <div className="flex justify-center">
          <p className="font-bold pt-8 pb-2 text-2xl border-b-2 border-grey-500 text-white">
            Paper Wise Marking
          </p>
        </div>
        <div className="flex justify-around mt-2">
          <div>
            <div className="font-bold py-2 text-[1.1rem]">Correct Marks</div>
            <div className="flex justify-center">
              <input
                className="w-[60px] text-center bg-transparent border-2 text-white focus:bg-white focus:text-black outline-0 font-bold"
                ref={correctAnswerPoint}
                type="number"
                min={0}
                step={0.25}
                onChange={handleCorrectPoints}
                defaultValue={1}
                onBlur={() =>
                  ctx.paperMarkHandler({
                    correctPoint: +correctAnswerPoint.current.value,
                  })
                }
              ></input>
            </div>
          </div>
          <div>
            <div className="font-bold py-2 text-[1.1rem]">Wrong Marks</div>
            <div className="flex justify-center">
              <input
                className="w-[60px] text-center bg-transparent border-2 text-white focus:bg-white focus:text-black outline-0 font-bold"
                ref={wrongAnswerPoint}
                type="number"
                defaultValue={0}
                min={0}
                step={0.25}
                onBlur={() => {
                  ctx.paperMarkHandler({
                    wrongPoint: +wrongAnswerPoint.current.value,
                  });
                }}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarksApply;
