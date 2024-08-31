import React, { useContext, useRef, useState } from "react";
import ResultGenerationContext from "../../Store/ResultGenerationContext";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import effect from "./backEffect.module.css";

const SubjectWiseMarkApply = () => {
  const SubjectStartKey = useRef(-1);
  const SubjectEndKey = useRef(-1);
  const correctSubjectPoint = useRef();
  const wrongSubjectPoint = useRef();
  const subjectName = useRef("");

  const [subjectEndDropDownOpen, setSubjectEndDropdownOpen] = useState(false);
  const [subjectStartDropDownOpen, setSubjectStartDropDownOpen] =
    useState(false);

  const ctx = useContext(ResultGenerationContext);
  const subjectWiseMarking = ctx.subjectMarkings;
  const keyHEaders = ctx.keyHeaders;
  const subjectMarkHandler = (start, end, subName, correctMark, wrongMark) => {
    if (!start) {
      toast.error(
        "select valid starting question value in subject wise marking ...."
      );
      return;
    }
    if (!end) {
      toast.error(
        "select valid end question value in subject wise marking ...."
      );
      return;
    }
    if (correctMark < 0) {
      toast.error(
        "correct mark should be a positive number....in subject wise marking"
      );
      return;
    }
    if (wrongMark < 0) {
      toast.error(
        "wrong mark should be a positive number....in subject wise marking"
      );
      return;
    }
    if (subName == "") {
      toast.error(
        "empty value !!! in subject name field in subject wise marking ...."
      );
      return;
    }
    const finditem = subjectWiseMarking.find(
      (current) => current.subject == subName
    );

    if (finditem) {
      toast.error(
        "choose a different subject name in subject wise marking...."
      );
      return;
    }
    if (!finditem) {
      ctx.subjectMarkHandler({
        subject: subName,
        start: start,
        end: end,
        correctPoint: +correctMark,
        wrongPoint: +wrongMark,
      });
    }
  };

  return (
    <div className="m-2 mt-10 w-[100%]  pe-4">
      <div className="flex justify-center">
        <div
          className={` animate__animated animate__zoomInUp animate__delay-2s w-[100%] max-w-[600px] h-fit bg-gradient-to-r from-red-600 to-yellow-500 pb-8 rounded-lg shadow-md shadow-gray-500 `}
          style={{ filter: "" }}
        >
          <div className="flex justify-center ">
            <p className="font-bold pt-8 pb-2 text-2xl border-b-2 border-grey-500 text-white">
              Subject Wise Marking
            </p>
          </div>
          <div className="flex  max-[816px]:flex-col-reverse  items-center">
            <div className="min-[816px]:w-[60%] mt-4">
              <div className="flex justify-between mt-2 mx-4 min-[816px]:text-center">
                <div
                  className="font-bold text-[1.1rem] "
                  onClick={() => {
                    // setSubjectStartDropDownOpen(!subjectStartDropDownOpen);
                  }}
                >
                  Start Que :
                  <div className="w-[120px]   min-[816px]:mx-4 my-2  overflow-x-hidden font-medium border-white border-2  cursor-pointer">
                    {SubjectStartKey.current < 0 ? (
                      <div
                        className="text-white text-center"
                        onClick={() => {
                          setSubjectStartDropDownOpen(
                            !subjectStartDropDownOpen
                          );
                        }}
                      >
                        select here
                      </div>
                    ) : (
                      <p
                        onClick={() => {
                          setSubjectStartDropDownOpen(
                            !subjectStartDropDownOpen
                          );
                        }}
                      >
                        {keyHEaders[0][SubjectStartKey.current]}
                      </p>
                    )}
                    {subjectStartDropDownOpen && (
                      <div className="bg-blue-500  overflow-x-hidden overflow-y-scroll  h-[80px] ">
                        {keyHEaders[0].map((current, index) => {
                          return (
                            <div
                              className="border-b  whitespace-nowrap overflow-hidden overflow-ellipsis text-md mx-2 hover:bg-white hover:px-2"
                              onClick={() => {
                                setSubjectStartDropDownOpen(
                                  !subjectStartDropDownOpen
                                );

                                SubjectStartKey.current = index;
                              }}
                              key={index}
                            >
                              {" "}
                              {current}
                            </div>
                          );
                        })}{" "}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="font-bold text-[1.1rem] "
                  onClick={() => {
                    // setSubjectEndDropdownOpen(!subjectEndDropDownOpen);
                  }}
                >
                  End Que :
                  <div className="w-[120px]   min-[816px]:mx-4 my-2  overflow-x-hidden font-medium border-white border-2  cursor-pointer">
                    {SubjectEndKey.current == -1 ? (
                      <div
                        className="text-white text-md text-center"
                        onClick={() => {
                          setSubjectEndDropdownOpen(!subjectEndDropDownOpen);
                        }}
                      >
                        select here
                      </div>
                    ) : (
                      <p
                        onClick={() => {
                          setSubjectEndDropdownOpen(!subjectEndDropDownOpen);
                        }}
                      >
                        {keyHEaders[0][SubjectEndKey.current]}
                      </p>
                    )}
                    {subjectEndDropDownOpen && (
                      <div className="bg-blue-500  overflow-x-hidden overflow-y-scroll  h-[80px] ">
                        {keyHEaders[0].map((current, index) => {
                          return (
                            <div
                              className="border-b whitespace-nowrap overflow-hidden overflow-ellipsis text-md mx-2 hover:bg-white hover:px-2"
                              onClick={() => {
                                setSubjectEndDropdownOpen(
                                  !subjectEndDropDownOpen
                                );

                                SubjectEndKey.current = index;
                              }}
                            >
                              {current}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2 mx-4 min-[816px]:text-center ">
                <div className="font-bold text-[1.1rem] mx-4">
                  <p>
                    Correct <span className="">(+)</span> :
                  </p>
                  <input
                    className="w-[50px] mx-4 my-2 text-center cursor-pointer bg-transparent border-2 text-white"
                    defaultValue={1}
                    min={0}
                    step={0.25}
                    type="number"
                    ref={correctSubjectPoint}
                    onChange={(e) =>
                      (correctSubjectPoint.current.value = e.target.value)
                    }
                  ></input>
                </div>
                <div className="font-bold text-[1.1rem]">
                  <p>
                    Wrong<span className="">(-)</span> :
                  </p>
                  <input
                    className="w-[50px] mx-4 my-2 text-center  cursor-pointer bg-transparent border-2 text-white"
                    defaultValue={0}
                    min={0}
                    step={0.25}
                    type="number"
                    ref={wrongSubjectPoint}
                    onChange={(e) =>
                      (wrongSubjectPoint.current.value = e.target.value)
                    }
                  ></input>
                </div>
              </div>
            </div>
            <div className=" mt-4 h-[150px] w-[60%] min-[816px]:w-[40%] mx-2 flex flex-col items-center bg-white shadow-md shadow-blue-400 ">
              <div className="bg-blue-400 w-[100%] text-center font-semibold text-xl py-2 text-yellow-400">
                Selected Subject
              </div>
              <div className="overflow-y-scroll h-[100px] w-[100%] text-center  ">
                {subjectWiseMarking.length <= 0 && (
                  <div className="flex items-center w-full h-full justify-center">
                    no subject present
                  </div>
                )}
                {subjectWiseMarking.map((current) => (
                  <div className="font-bold bg-white items-center border-b border-blue-600 flex justify-between py-2">
                    <p className="ms-2 text-gray-400">{current.subject}</p>
                    <p className="mx-2">
                      <RiDeleteBin6Line
                        className="text-2xl text-red-500 hover:text-red-600 hover:text-3xl"
                        onClick={() => {
                          ctx.deleteSubjectHandler(current.subject);
                          // deleteSubjectHandler(current.subject);
                        }}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6 mx-4 text-center w-[100%]">
            <div className="flex text-[1.1rem] font-bold justify-center  mx-8">
              Subject :{" "}
              <input
                className="text-center mx-2 max-w-[150px] min-w-[120px] "
                placeholder="type here... "
                ref={subjectName}
              ></input>
              <div
                className="mx-2 border-2 border-yellow-500 px-2 bg-blue-400 font-bold text-white rounded-md flex items-center justify-center"
                onClick={() => {
                  subjectMarkHandler(
                    SubjectStartKey.current,
                    SubjectEndKey.current,
                    subjectName.current.value,
                    correctSubjectPoint.current.value,
                    wrongSubjectPoint.current.value
                  );
                }}
              >
                Add
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectWiseMarkApply;
