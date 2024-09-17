import React from "react";
import Draggable from "react-draggable";

const CoordinateData = ({
  onSelectedHandler,
  open,
  onResetHandler,
  fieldType,
  setFieldType,
  setSelectType,
  selectType,
  questionRange,
  setQuestionRange,
  lengthOfField,
  setLengthOfField,
  inputField,
  setInputField,
}) => {
  return (
    <>
      {open && (
        <Draggable handle=".modal-header" cancel=".no-drag">
          <div className={`fixed inset-0 z-50 mt-40`}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="modal-header bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 cursor-move">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {fieldType === "formField" ? "Add Field" : "Add Field"}
                      </h3>
                    </div>
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={onResetHandler}
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex gap-5 p-3">
                      <label
                        htmlFor="formField"
                        className="flex items-center font-semibold"
                      >
                        <input
                          type="radio"
                          id="formField"
                          name="fieldType"
                          value="formField"
                          className="form-radio text-blue-500 no-drag"
                          required
                          checked={fieldType === "formField"}
                          onChange={() => setFieldType("formField")}
                        />
                        <span className="ml-2 text-lg text-gray-700">
                          Form Field
                        </span>
                      </label>
                      <label
                        htmlFor="questionsField"
                        className="flex items-center font-semibold"
                      >
                        <input
                          type="radio"
                          id="questionsField"
                          name="fieldType"
                          value="questionsField"
                          className="form-radio text-blue-500 no-drag"
                          required
                          checked={fieldType === "questionsField"}
                          onChange={() => setFieldType("questionsField")}
                        />
                        <span className="ml-2 text-lg text-gray-700">
                          Questions Field
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:flex sm:px-6 justify-between">
                    {fieldType === "formField" || fieldType === "" ? (
                      <div className="flex flex-col">
                        <div className="flex gap-10">
                          <select
                            onChange={(e) => setSelectType(e.target.value)}
                            value={selectType}
                            className="input w-full sm:w-[32%] border-2 font-semibold bg-white text-lg focus:border-1 rounded-xl px-3 py-2 shadow-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none no-drag"
                          >
                            <option value="">Select Type</option>
                            <option value="text">Alpha</option>
                            <option value="number">Numeric</option>
                            <option value="alphanumeric">AlphaNumeric</option>
                          </select>
                        </div>
                        <div className="mt-8 flex gap-5">
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-700">
                              Field Length
                            </span>
                            <input
                              type="number"
                              id="Quantity"
                              value={lengthOfField}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value >= 0) {
                                  setLengthOfField(e.target.value);
                                }
                              }}
                              className="h-10 w-16 rounded border-2 border-gray-200 text-center no-drag"
                            />
                          </div>
                          <input
                            required
                            className="input w-full sm:w-[36%] border-2 font-semibold bg-white text-lg focus:border-1 rounded-xl px-3 py-2 shadow-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none no-drag"
                            type="text"
                            name="field"
                            placeholder="Field name..."
                            value={inputField}
                            onChange={(e) => setInputField(e.target.value)}
                          />
                          <button
                            type="button"
                            className="bg-teal-600 hover:bg-indigo-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-200 text-md font-medium px-6"
                            onClick={onSelectedHandler}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-5">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-700">Start</span>
                          <input
                            type="number"
                            id="Quantity"
                            value={questionRange.min}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 0) {
                                setQuestionRange({
                                  ...questionRange,
                                  min: value,
                                });
                              }
                            }}
                            className="h-10 w-16 rounded border-2 border-gray-200 text-center no-drag"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-700">End</span>
                          <input
                            type="number"
                            id="Quantity"
                            value={questionRange.max}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 0) {
                                setQuestionRange({
                                  ...questionRange,
                                  max: value,
                                });
                              }
                            }}
                            className="h-10 w-16 rounded border-2 border-gray-200 text-center no-drag"
                          />
                        </div>
                        <button
                          type="button"
                          className="bg-teal-600 hover:bg-indigo-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-200 text-md font-medium px-6"
                          onClick={onSelectedHandler}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </>

  );
};

export default CoordinateData;
