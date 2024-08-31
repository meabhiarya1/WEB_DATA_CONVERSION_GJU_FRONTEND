import React from "react";

const DataOption = ({
  blankChecked,
  handleCheckboxChange,
  blankCount,
  pattern,
  setPattern,
  setBlackCount,
  multChecked,
  allDataChecked,
  onTaskStartHandler,
  currentTaskData,
  loading,
  setStartModal,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto ">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className=" inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h1 className="text-xl font-bold text-gray-500 mb-6">
                  Please select the options
                </h1>
                <div className="text-gray-600 font-semibold my-2 overflow-y-auto h-[200px]">
                  <fieldset>
                    <legend className="sr-only">Options</legend>
                    <div className="divide-y divide-gray-200">
                      <label
                        htmlFor="blank"
                        className="flex cursor-pointer items-start gap-4 py-4"
                      >
                        <div className="flex items-center">
                          &#8203;
                          <input
                            type="checkbox"
                            className="size-4 rounded border-gray-300"
                            id="blank"
                            checked={blankChecked}
                            onChange={() => handleCheckboxChange("blank")}
                          />
                        </div>
                        <div className="flex justify-between w-[100%]">
                          <strong className="font-medium text-gray-900">
                            Blank
                          </strong>

                          {blankChecked && (
                            <input
                              type="number"
                              min="1"
                              required
                              value={blankCount}
                              onChange={(e) => setBlackCount(e.target.value)}
                              id="Line3Qty"
                              class="h-12 w-16 rounded border-gray-200 bg-gray-200 p-0 text-center text-xl text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                            />
                          )}
                        </div>
                      </label>

                      <label
                        htmlFor="mult"
                        className="flex cursor-pointer items-start gap-4 py-4"
                      >
                        <div className="flex items-center">
                          &#8203;
                          <input
                            type="checkbox"
                            className="size-4 rounded border-gray-300"
                            id="mult"
                            checked={multChecked}
                            onChange={() => handleCheckboxChange("mult")}
                          />
                        </div>
                        <div className="flex justify-between w-[100%]">
                          <strong className="font-medium text-gray-900">
                            Pattern
                          </strong>

                          {multChecked && (
                            <input
                              type="text"
                              required
                              value={pattern}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (
                                  inputValue.length === 0 ||
                                  (inputValue.length === 1 &&
                                    /[/*~>-]/.test(inputValue))
                                ) {
                                  setPattern(inputValue);
                                }
                              }}
                              id="Line3Qty"
                              class="h-12 w-16 rounded border-gray-200 bg-gray-200 p-0 text-center text-xl text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                            />
                          )}
                        </div>
                      </label>

                      {!blankChecked && !multChecked && (
                        <label
                          htmlFor="allData"
                          className="flex cursor-pointer items-start gap-4 py-4"
                        >
                          <div className="flex items-center">
                            &#8203;
                            <input
                              type="checkbox"
                              className="size-4 rounded border-gray-300"
                              id="allData"
                              checked={allDataChecked}
                              onChange={() => handleCheckboxChange("allData")}
                            />
                          </div>
                          <div>
                            <strong className="font-medium text-gray-900">
                              All Data
                            </strong>
                          </div>
                        </label>
                      )}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => onTaskStartHandler(currentTaskData)}
              type="button"
              disabled={loading ? true : false}
              className={`my-3 ml-3 w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent px-4 py-2 bg-teal-600 text-base leading-6 font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Loading...</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              ) : (
                "Confirm"
              )}
            </button>

            <button
              onClick={() => setStartModal(true)}
              type="button"
              className=" my-3 w-full sm:w-auto inline-flex justify-center rounded-xl
border border-transparent px-4 py-2 bg-gray-300 text-base leading-6 font-semibold text-gray-700 shadow-sm hover:bg-gray-400 focus:outline-none focus:border-gray-600 focus:shadow-outline-gray transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataOption;
