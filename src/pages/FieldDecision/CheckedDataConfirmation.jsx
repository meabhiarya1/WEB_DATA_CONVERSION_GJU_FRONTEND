import React from "react";

const CheckedDataConfirmation = ({
  confirmModal,
  setConfirmModal,
  onChekedDataHandler,
  loading,
}) => {
  return (
    <div>
      {confirmModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Your icon */}
                    <svg
                      onClick={() => setConfirmModal(false)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6 text-green-600 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg font-medium text-gray-900"
                      id="modal-title"
                    >
                      Confirm Data Save
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please confirm your intention to save the checked data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end py-3 px-3">
                <button
                  onClick={onChekedDataHandler}
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
                  onClick={() => setConfirmModal(false)}
                  type="button"
                  className={`my-3 ml-3 w-full sm:w-auto inline-flex justify-center rounded-xl border-2 px-4 py-2 bg-white text-base leading-6 font-semibold text-black shadow-sm hover:bg-gray-300 focus:outline-none focus:border-gray-700 focus:shadow-outline-teal transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckedDataConfirmation;
