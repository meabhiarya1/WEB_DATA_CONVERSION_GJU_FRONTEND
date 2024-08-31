import React from "react";
import { toast } from "react-toastify";
import Draggable from "react-draggable";
const Permissions = ({
  permissionModal,
  setPermissionModal,
  templatePermissions,
  setTemplatePermissions,
}) => {
  return (
    <>
      {permissionModal && (
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
            <Draggable cancel=".modal-body">
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start flex-col">
                    <div className="mt-3 flex justify-center items-center gap-10 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg font-medium text-gray-900 w-[220px]"
                        id="modal-title"
                      >
                        {"Patterns Defination   /-*~>"}
                      </h3>
                      {/* Input field with validation */}
                      <div className="mt-4">
                        <input
                          type="text"
                          required
                          value={templatePermissions.patternDefinition}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (
                              inputValue.length === 0 ||
                              (inputValue.length === 1 &&
                                /[/*~>-]/.test(inputValue))
                            ) {
                              setTemplatePermissions((prev) => ({
                                ...prev,
                                patternDefinition: inputValue,
                              }));
                            }
                          }}
                          id="Line3Qty"
                          className="h-12 w-32 rounded border border-gray-300 bg-gray-100 p-3 text-center text-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-center items-center gap-10 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg font-medium text-gray-900 w-[220px]"
                        id="modal-title"
                      >
                        Blank Defination
                      </h3>
                      {/* Input field with validation */}
                      <div className="mt-4">
                        <input
                          type="text"
                          required
                          value={templatePermissions?.blankDefination}
                          onChange={(e) =>
                            setTemplatePermissions((prev) => ({
                              ...prev,
                              blankDefination: e.target.value,
                            }))
                          }
                          id="Line3Qty"
                          className="h-12 w-32 rounded border border-gray-300 bg-gray-100 p-3 text-center text-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-center items-center gap-10 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg font-medium text-gray-900 w-[220px]"
                        id="modal-title"
                      >
                        Field Edit Permission
                      </h3>
                      {/* Checkbox for field edit permission */}
                      <div className="mt-4 flex items-center">
                        <input
                          type="checkbox"
                          checked={templatePermissions.isPermittedToEdit}
                          onChange={() =>
                            setTemplatePermissions((prev) => ({
                              ...prev,
                              isPermittedToEdit:
                                !templatePermissions.isPermittedToEdit,
                            }))
                          }
                          id="editFieldPermission"
                          className="h-6 w-6 rounded border border-gray-300 bg-gray-100 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                        <label
                          htmlFor="editFieldPermission"
                          className="ml-2 text-xl text-gray-600"
                        >
                          Allow field edit
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end py-3 px-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!templatePermissions.patternDefinition) {
                          toast.warning("Please enter any pattern.");
                        } else {
                          setPermissionModal(false);
                        }
                      }}
                      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setPermissionModal(false)}
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Draggable>
          </div>
        </div>
      )}
    </>
  );
};

export default Permissions;
