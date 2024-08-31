import React, { useContext } from "react";

import { toast } from "react-toastify";
import ResultGenerationContext from "../../Store/ResultGenerationContext";

const GenerateResultCsv = (props) => {
  const ctx = useContext(ResultGenerationContext);
  const dataHeaders = ctx.dataHeaders;
  const keyHEaders = ctx.keyHeaders;
  const mappedKey = ctx.paperMappedKey;
  const subjectWiseMarking = ctx.subjectMarkings;
  let subjectHeaders = [];
  let finalAnswers = [];
  let headers = [];
  const resultGenerator = () => {
    subjectHeaders = [];
    finalAnswers = [];
    headers = [];
    if (subjectWiseMarking == 0) {
      headers = ["notAttempted", "wrongAnswer", "correctAnswer", "total_Score"];
    } else {
      headers = ["total"];
    }

    // setKeyVisble(true);
    if (mappedKey == null) {
      toast.error("please select mapped key");
      return;
    }
    if (ctx.paperMarkings.start === null && subjectWiseMarking.length == 0) {
      toast.error("please select start question");
      return;
    }
    if (ctx.paperMarkings.end <= 0) {
      toast.error("please select valid value for total questions");
      return;
    }
    if (ctx.paperMarkings.correctPoint < 0) {
      toast.error("correct marks value should be positive number ");
      return;
    }
    if (ctx.paperMarkings.wrongPoint < 0) {
      toast.error("wrong marks value should be positive number ");
      return;
    }
    // toast("csv file mapping started.....wait");
    for (let i = 1; i < dataHeaders.length; i++) {
      //we will go to each student attempted question in data file

      let startpoint = +ctx.paperMarkings.start;

      let endPoint = +startpoint + +ctx.paperMarkings.end - 1;

      let CorrectAnswer = 0;
      let WrongAnswer = 0;
      let NotAttempted = 0;

      let correctPoint = +ctx.paperMarkings.correctPoint;

      let wrongPoint = +ctx.paperMarkings.wrongPoint;

      let subjectHEaderPushCount = 1;
      for (let j = 1; j < keyHEaders.length; j++) {
        //we will try to find mapped key in key file so that student attempted paper in data file will be  matched with student key file target keys
        if (dataHeaders[i][mappedKey] == keyHEaders[j][mappedKey]) {
          let currentIndex = 0;
          let AllOutPutHeaders = {};

          while (currentIndex < keyHEaders[0].length) {
            let currentHeaders = keyHEaders[0][currentIndex];
            AllOutPutHeaders = {
              ...AllOutPutHeaders,
              [currentHeaders]: dataHeaders[i][currentHeaders],
            };

            currentIndex++;
          }

          if (subjectWiseMarking.length > 0) {
            let studentData = {};
            let allSubjectTotal = 0;
            for (let k = 0; k < subjectWiseMarking.length; k++) {
              if (i == 1 && subjectHEaderPushCount == 1) {
                headers.push(
                  `${subjectWiseMarking[k].subject}_notAttempted`,
                  `${subjectWiseMarking[k].subject}_Attempted`,
                  `${subjectWiseMarking[k].subject}_wrongAnswer`,
                  `${subjectWiseMarking[k].subject}_total`
                );
              }

              startpoint = +subjectWiseMarking[k].start;
              endPoint = +subjectWiseMarking[k].end;
              CorrectAnswer = 0;
              WrongAnswer = 0;
              NotAttempted = 0;

              let subjectTotal = 0;
              while (startpoint <= endPoint) {
                let currentHeaders = keyHEaders[0][startpoint];

                if (
                  dataHeaders[i][currentHeaders] == "" ||
                  keyHEaders[j][currentHeaders] == ""
                ) {
                  NotAttempted++;
                } else if (
                  keyHEaders[j][currentHeaders] ==
                  dataHeaders[i][currentHeaders]
                ) {
                  CorrectAnswer++;
                } else if (
                  keyHEaders[j][currentHeaders] !=
                  dataHeaders[i][currentHeaders]
                ) {
                  WrongAnswer++;
                }

                startpoint++;
              }
              subjectTotal =
                CorrectAnswer * +subjectWiseMarking[k].correctPoint -
                +WrongAnswer * +subjectWiseMarking[k].wrongPoint;
              allSubjectTotal += subjectTotal;
              studentData = {
                ...studentData,
                [`${subjectWiseMarking[k].subject}_notAttempted`]: NotAttempted,
                [`${subjectWiseMarking[k].subject}_Attempted`]: CorrectAnswer,
                [`${subjectWiseMarking[k].subject}_wrongAnswer`]: WrongAnswer,
                [`${subjectWiseMarking[k].subject}_total`]: subjectTotal,
                total: allSubjectTotal,
              };
            }
            subjectHEaderPushCount++;
            finalAnswers.push({ ...studentData, ...AllOutPutHeaders });

            // finalAnswers.push(studentData);
          } else {
            while (startpoint <= endPoint) {
              let currentHeaders = keyHEaders[0][startpoint];
              if (dataHeaders[i][currentHeaders] == "") {
                NotAttempted++;
              } else if (
                keyHEaders[j][currentHeaders] == dataHeaders[i][currentHeaders]
              ) {
                CorrectAnswer++;
              } else if (
                keyHEaders[j][currentHeaders] != dataHeaders[i][currentHeaders]
              ) {
                WrongAnswer++;
              } else {
              }
              //     console.log(dataHeaders[0], dataHeaders[i][currentHeaders]);
              startpoint++;
            }
            // return;
            finalAnswers.push({
              ...AllOutPutHeaders,
              // ROLL_NO: dataHeaders[i].ROLL_NO,
              // Paper_No: dataHeaders[i].Paper_No,
              notAttempted: NotAttempted,
              wrongAnswer: WrongAnswer,
              correctAnswer: CorrectAnswer,
              total_Score:
                CorrectAnswer * correctPoint - WrongAnswer * wrongPoint,
            });
          }

          break;

          //working code
        } else {
        }
      }
    }

    const data = finalAnswers;
    headers = [...props.headers, ...headers];
    //  return;
    const csvData = convertArrayOfObjectsToCSV(
      data,
      headers
      // subjectWiseMarking.length > 0
      //   ? [...subjectHeaders, props.headers]
      //   : props.headers
    );
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const convertArrayOfObjectsToCSV = (data, headersData) => {
    const headerLine = headersData.join(",");
    const csv = data.map((item) => {
      return headersData
        .map((header) => {
          return item[header];
        })
        .join(",");
    });
    return [headerLine, ...csv].join("\n");
  };
  return (
    <div className="text-center mt-2 flex flex-row min-[1103px]:flex-col  justify-center">
      <div className="text-center mt-4 ">
        <button
          className="animate__animated animate__bounceInLeft animate__delay-4s group inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75 mx-4 shadow-md shadow-blue-300"
          onClick={resultGenerator}
        >
          <span className="block rounded-full bg-white px-8 py-3 text-md font-bold group-hover:bg-transparent hover:text-white text-black">
            Generate Result
          </span>
        </button>
      </div>
      {/* <div className="text-center mt-4 ">
        <a
          className="animate__animated animate__bounceInLeft animate__delay-5s group inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75 mx-4 shadow-md shadow-blue-300"
          href="#"
        >
          <span className="block rounded-full bg-white px-8 py-3 text-sm font-bold group-hover:bg-transparent hover:text-white text-black">
            cancel
          </span>
        </a>
      </div> */}
    </div>
  );
};

export default GenerateResultCsv;
