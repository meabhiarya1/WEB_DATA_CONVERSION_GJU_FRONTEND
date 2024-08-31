import React from "react";

const HeaderMappedReview = ({
  onMapSubmitHandler,
  setShowModal,
  showModal,
  selectedAssociations,
}) => {
  return (
    <div className="text-center mt-5 pt-5">
      <label
        onClick={() => setShowModal(true)}
        className="font-medium text-white bg-teal-600 rounded-3xl
         shadow-md cursor-pointer select-none text-xl px-16 py-2 hover:shadow-xl active:shadow-md"
      >
        <span>Save</span>
      </label>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto ">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className=" inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h1 className="text-xl  font-bold text-gray-500 mb-6">
                      Mapped Data..
                    </h1>
                    <div className="text-gray-600 font-semibold my-2 overflow-y-auto h-[300px]">
                      <dl className="-my-3 divide-y divide-gray-100 text-sm">
                        {Object.entries(selectedAssociations).map(
                          ([csvHeader, templateHeader], index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 gap-1 py-3 text-center even:bg-gray-50 sm:grid-cols-3 sm:gap-4"
                            >
                              <dt className="font-medium text-md text-gray-700 text-center">
                                {csvHeader}
                              </dt>
                              <dd className="text-gray-700 font-medium sm:col-span-2 text-center">
                                {templateHeader}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    onMapSubmitHandler();
                    setShowModal(false);
                  }}
                  type="button"
                  className=" my-3 ml-3 w-full sm:w-auto inline-flex justify-center rounded-xl
         border border-transparent px-4 py-2 bg-teal-600 text-base leading-6 font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:border-teal-700 focus:shadow-outline-teal transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowModal(false)}
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
      )}
    </div>
  );
};

export default HeaderMappedReview;
