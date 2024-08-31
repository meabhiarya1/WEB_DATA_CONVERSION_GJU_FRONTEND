import React from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

const TemplateData = ({
  selectedCoordinates,
  setRemoveModal,
  setRemoveId,
  templateData,
  setTemplateData,
  setOptionModel,
  onEditCoordinateDataHanlder,
  setConfirmationModal,
  setPermissionModal,
  templatePermissions,
}) => {
  const onCheckHandler = () => {
    if (!templatePermissions.patternDefinition) {
      setPermissionModal(true);
      toast.warning("Please select the pattern.");
      return;
    }

    const isQuestionsField = selectedCoordinates.find(
      (coordinate) => coordinate.fieldType === "questionsField"
    );
    if (selectedCoordinates.length === 0) {
      toast.warning("Please create the coordinates.");
    } else if (templateData.name === "") {
      toast.warning("Please enter the template name.");
    } else if (!isQuestionsField) {
      setConfirmationModal(true);
    } else {
      setOptionModel(true);
    }
  };

  return (
    <div className="px-4 py-6 ">
      <div className="">
        <div className="block w-full rounded-3xl bg-gray-100 px-6 py-2 text-sm font-medium  mb-5">
          <div className="overflow-x-auto ">
            <div className="my-3 table-auto   border-collapse border border-gray-400 min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded-3xl">
              <div className="ltr:text-left rtl:text-right flex justify-around text-gray-600">
                <div className="text-center text-lg whitespace-nowrap py-4 w-1/3">
                  Name
                </div>
                <div className="text-center text-lg whitespace-nowrap py-4 w-1/3">
                  Edit
                </div>
                <div className="text-center text-lg whitespace-nowrap py-4 w-1/3">
                  Remove
                </div>
              </div>

              <div className="divide-y divide-gray-200 overflow-y-auto min-h-[25vh] h-[30vh]">
                {selectedCoordinates &&
                  selectedCoordinates?.map((data) => (
                    <div
                      key={data.fId}
                      className="odd:bg-gray-50 h-[40px] flex justify-around"
                    >
                      <div className="whitespace-nowrap px-4 py-2 text-center font-semibold text-md text-gray-900 text-ellipsis overflow-x-hidden w-1/3">
                        {data.attribute}
                      </div>
                      <div className="whitespace-nowrap px-4 py-2 text-center font-semibold text-md text-gray-900 w-1/3">
                        <CiEdit
                          onClick={() => onEditCoordinateDataHanlder(data.fId)}
                          className="mx-auto text-blue-500 text-xl cursor-pointer hover:text-2xl hover:font-bold"
                        />
                      </div>
                      <div className="whitespace-nowrap px-4 py-2 text-center font-semibold text-md text-gray-900 w-1/3">
                        <MdDelete
                          onClick={() => {
                            setRemoveModal(true);
                            setRemoveId(data.fId);
                          }}
                          className="mx-auto text-red-500 text-xl hover:text-2xl hover:font-bold cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Form Field Area */}
          <div className="bg-gray-100 rounded-3xl px-8 py-6 border-1 border-gray shadow-md mb-10">
            <div>
              <input
                required
                className="input w-full font-semibold bg-white  border-none rounded-xl p-3 mt-6 shadow-lg shadow-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                type="text"
                value={templateData.name}
                onChange={(e) =>
                  setTemplateData({
                    ...templateData,
                    name: e.target.value,
                  })
                }
                placeholder="enter template name.."
              />
              <div className="md:flex-col sm:flex-col">
                <button
                  onClick={() => setPermissionModal(true)}
                  className="ms-auto group rounded-md mt-6 flex items-center md:w-full sm:w-full bg-indigo-600 hover:shadow-lg hover:shadow-blue-200 py-2 px-4 transition-colors hover:bg-indigo-700 focus:outline-none focus:ring"
                >
                  <span className="font-medium flex text-white transition-colors group-hover:text-white group-active:text-white mx-auto">
                    Select Pattern
                  </span>
                </button>
                <button
                  onClick={onCheckHandler}
                  className="ms-auto group rounded-md mt-6 flex items-center md:w-full sm:w-full bg-teal-600 hover:shadow-lg hover:shadow-blue-200 py-2 px-4 transition-colors hover:bg-teal-700 focus:outline-none focus:ring"
                >
                  <span className="font-medium flex text-white transition-colors group-hover:text-white group-active:text-white mx-auto">
                    Save Template
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateData;
