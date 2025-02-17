import React from "react";

const FormDataSection = ({
  csvCurrentData,
  csvData,
  templateHeaders,
  imageColName,
  inputRefs,
  handleKeyDownJump,
  changeCurrentCsvDataHandler,
  imageFocusHandler,
  focusedIndex,
  setFocusedIndex
}) => {

  const blankDefinition = templateHeaders?.blankDefination === "space" ? " " : templateHeaders?.blankDefination;

  return (
    <div className="border-e lg:w-3/12 xl:w-[20%] order-lg-1">
      <div className="overflow-hidden w-[100%]">
        <article
          style={{ scrollbarWidth: "thin" }}
          className="py-10 mt-5 lg:mt-16 shadow transition hover:shadow-lg mx-auto overflow-y-auto lg:h-[80vh] rounded-lg flex flex-row lg:flex-col lg:items-center w-[95%] bg-blue-500"
        >
          {csvCurrentData &&
            Object.entries({ ...csvData[0] }).map(([key, value], i) => {
              const templateFormData = templateHeaders?.templetedata.find(
                (data) => data.attribute === value && data.fieldType === "formField"
              );

              if (key !== imageColName && templateFormData) {
                const isEmptyOrBlank =
                  !csvCurrentData[key] ||
                  csvCurrentData[key] === blankDefinition ||
                  (typeof csvCurrentData[key] === "string" &&
                    (csvCurrentData[key].includes(templateHeaders?.patternDefinition) ||
                      csvCurrentData[key].includes(blankDefinition)));

                return (
                  <div
                    key={i}
                    className="w-5/6 px-3 lg:px-0 py-1 overflow-x font-bold justify-center items-center"
                  >
                    <label className="w-full overflow-hidden rounded-md font-semibold py-2 shadow-sm">
                      <span className="text-sm text-white font-bold flex">
                        {key?.toUpperCase()}
                      </span>
                    </label>
                    <input
                      type="text"
                      className={`mt-1 border-none p-2 focus:border-transparent text-center rounded-lg focus:outline-none focus:ring-0 sm:text-sm w-48
                        ${isEmptyOrBlank ? "bg-red-500 text-black" : "bg-white"}
                        ${i === focusedIndex ? "bg-yellow-300 text-black" : ""}`}
                      ref={(el) => (inputRefs.current[i] = el)}
                      value={csvCurrentData[key]}
                      onKeyDown={(e) => handleKeyDownJump(e, i)}
                      onChange={(e) => changeCurrentCsvDataHandler(key, e.target.value)}
                      onFocus={() => {
                        imageFocusHandler(key)
                        setFocusedIndex(i)
                      }}
                      onBlur={() => setFocusedIndex(null)}
                    />
                  </div>
                );
              }
            })}
        </article>
      </div>
    </div>
  );
};

export default FormDataSection;
