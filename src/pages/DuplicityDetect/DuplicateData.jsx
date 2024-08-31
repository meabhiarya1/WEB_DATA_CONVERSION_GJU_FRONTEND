import DuplicateDataModel from "./DuplicateDataModel";
const DuplicateData = ({
  duplicatesData,
  columnName,
  onShowModalHandler,
  showDuplicateField,
  cancelButtonRef,
  setShowDuplicateField,
  allCurrentData,
  onEditModalHandler,
  onRemoveDuplicateHandler,
}) => {
  return (
    <div className="inline-block align-bottom pb-6 lg:h-[85vh] bg-teal-100  rounded-xl lg:ms-4 text-left shadow-md overflow-hidden transform transition-all  sm:align-middle w-[90%] ">
      <div className="px-4 ">
        <div className="sm:flex ">
          <div className="text-center sm:mt-0  sm:text-left w-full">
            <div className="flex justify-between mt-4 ">
              <h1 className="text-xl text-center font-bold  mb-6  w-1/2">
                Duplicates :<br />{" "}
                <span className="text-lg font-medium text-blue-600">
                  {duplicatesData?.length}
                </span>
              </h1>
              <h1 className="text-xl text-center font-bold  mb-6 w-1/2">
                Field :<br />{" "}
                <span className="text-lg font-medium text-blue-600">
                  {" "}
                  {columnName}
                </span>
              </h1>
            </div>
            <div className=" font-semibold my-2">
              <dl className="-my-3  text-sm">
                <div className="flex justify-around gap-1 py-3 font-bold even:bg-gray-50 sm:grid-cols-4 sm:gap-1 text-center w-full">
                  <dt className=" text-md  w-1/3">{columnName}</dt>
                  <dd className=" text-md w-1/3">Duplicates</dd>
                  <dd className="  text-md w-1/3">View</dd>
                </div>
              </dl>
            </div>
            <div
              className=" font-semibold pb-4 overflow-y-auto h-[10vh] lg:h-[40vh] mt-7"
              style={{ scrollbarWidth: "thin" }}
            >
              <dl className="-my-3 divide-y divide-gray-100 text-sm">
                {duplicatesData?.map((data, index) => (
                  <div
                    key={index}
                    className="flex justify-around gap-1 py-3 text-center even:bg-gray-50 sm:grid-cols-4 "
                  >
                    <dt className="font-medium text-md justify-center whitespace-normal items-center flex w-1/3">
                      {data?.sameData[0]?.row[columnName]}
                    </dt>
                    <dd className="font-medium items-center text-md w-1/3 flex justify-center ">
                      {data.sameData.length}
                    </dd>

                    <div className=" w-1/3 ">
                      <div className="relative">
                        <div className="inline-flex items-center overflow-hidden rounded-2xl border bg-white">
                          <button
                            onClick={() => onShowModalHandler(data, index)}
                            className="border-e px-3 py-2 bg-blue-500 text-white text-sm/none  hover:bg-gray-50 hover:text-gray-700"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Duplicate Data  */}
        {showDuplicateField && (
          <DuplicateDataModel
            showDuplicateField={showDuplicateField}
            cancelButtonRef={cancelButtonRef}
            setShowDuplicateField={setShowDuplicateField}
            columnName={columnName}
            allCurrentData={allCurrentData}
            onEditModalHandler={onEditModalHandler}
            onRemoveDuplicateHandler={onRemoveDuplicateHandler}
          />
        )}
      </div>
    </div>
  );
};

export default DuplicateData;
