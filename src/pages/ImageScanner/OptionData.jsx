import React from "react";
import { toast } from "react-toastify";
import Draggable from "react-draggable";

const OptionData = ({
  optionModel,
  setOptionModel,
  inputCount,
  setInputCount,
  createInputs,
  handleCreateInputs,
  setConfirmationModal,
  selectedRow,
}) => {
  return (
    <div>
      {optionModel && (
        <Draggable handle=".modal-header">
          <div className="fixed z-50 inset-0  mt-40">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="modal-header bg-gray-200 px-4 pt-2 pb-2 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Create Inputs box for Options
                  </h3>
                  <svg
                    onClick={() => setOptionModel(false)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 text-red-600 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 h-[60vh] overflow-auto">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <div className="mt-2">
                        <input
                          type="number"
                          value={inputCount}
                          onChange={(e) =>
                            setInputCount(parseInt(e.target.value))
                          }
                          className="border border-gray-300 rounded px-3 py-2 mr-2"
                          placeholder="Enter number of inputs"
                        />
                        <button
                          type="button"
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                          onClick={handleCreateInputs}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Dynamic inputs */}
                  <div className="mt-3">{createInputs()}</div>
                </div>
                <div className="flex justify-end py-3 px-3">
                  <button
                    onClick={() => {
                      if (!selectedRow) {
                        toast.warning("Please select the field option type.");
                        return;
                      } else {
                        setConfirmationModal(true);
                        setOptionModel(false);
                      }
                    }}
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setOptionModel(false)}
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default OptionData;
