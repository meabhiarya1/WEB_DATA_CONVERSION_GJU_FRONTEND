import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MdDelete } from "react-icons/md";
const DuplicateDataModel = ({
  showDuplicateField,
  cancelButtonRef,
  setShowDuplicateField,
  columnName,
  allCurrentData,
  onEditModalHandler,
  onRemoveDuplicateHandler,
}) => {
  return (
    <Transition.Root show={showDuplicateField} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setShowDuplicateField}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0  bg-opacity-5 backdrop-blur-sm transition-opacity "></div>
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center  sm:mt-0 sm:text-left w-full">
                      <Dialog.Title
                        as="h2"
                        className="text-xl mb-5 font-semibold leading-6 text-gray-900"
                      >
                        {columnName}
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="min-w-full divide-y divide-gray-200">
                          <div className="bg-gray-50 ">
                            <div className="flex">
                              <div className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                {columnName}
                              </div>
                              <div className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                Row Index
                              </div>
                              <div className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                Edit
                              </div>
                              <div className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                Remove
                              </div>
                            </div>
                          </div>
                          <div className="overflow-y-auto h-[400px]">
                            {allCurrentData &&
                              allCurrentData.map((data, index) => (
                                <div className="" key={index}>
                                  <div
                                    className={
                                      index % 2 === 0
                                        ? "bg-white flex-col"
                                        : "bg-teal-100 flex-col"
                                    }
                                  >
                                    <div className="flex">
                                      <div className="text-center py-4 whitespace-nowrap text-xs font-medium text-gray-900 w-1/4">
                                        {data.row[columnName]}
                                      </div>
                                      <div className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4 text-center">
                                        {data.index}
                                      </div>
                                      <div className="text-center py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                                        <button
                                          onClick={() =>
                                            onEditModalHandler(data, index)
                                          }
                                          className="border-e px-4 bg-gray-100 py-2 text-sm/none text-blue-600 rounded-3xl hover:bg-blue-200"
                                        >
                                          Edit
                                        </button>
                                      </div>
                                      <div
                                        className="text-center py-4 whitespace-nowrap text-red-500 text-2xl  w-1/4"
                                        onClick={() =>
                                          onRemoveDuplicateHandler(
                                            index,
                                            data.index,
                                            data.row[columnName]
                                          )
                                        }
                                      >
                                        <MdDelete className="mx-auto text-2xl hover:text-3xl" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DuplicateDataModel;
