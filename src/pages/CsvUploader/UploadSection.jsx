import React from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
const UploadSection = ({
  onImageFolderHandler,
  setEditId,
  setEditModal,
  data,
  templateName,
  setTemplateName,
  imageNames,
  filteredTemplates,
  selectedId,
  setSelectedId,
  setRemoveModal,
  setRemoveId,
  handleImageNameChange,
  UploadFile,
  csvFile,
  onCsvFileHandler,
  imageFolder,
  onSaveFilesHandler,
}) => {

 
  return (
    <div className="pt-4 xl:pt-0 bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="xl:flex justify-center items-center gap-5 mx-5 pt-20">
        <div className="mx-auto max-w-xl mt-5 min-h-[300px] bg-white px-8 py-4 text-center shadow-lg rounded-3xl">
          <h1 className="mb-3 text-xl font-semibold text-center text-blue-600">
            Template Name
          </h1>
          <div className="form relative pb-3">
            <button className="absolute" style={{ top: "10px", left: "10px" }}>
              <svg
                className="w-5 h-5 text-gray-700"
                aria-labelledby="search"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                height="16"
                width="17"
              >
                <path
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="1.333"
                  stroke="currentColor"
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                ></path>
              </svg>
            </button>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              required
              placeholder="Search..."
              className="input rounded-full ps-8 py-1 border-2 border-blue-500 focus:outline-none focus:border-blue-700 placeholder-gray-400"
            />
          </div>
          <div className="overflow-y-scroll h-[20vh] px-2 bg-white">
            {filteredTemplates?.map((template) => (
              <p
                key={template.id}
                onClick={() => setSelectedId(template.id)}
                className={`group flex items-center justify-between w-full cursor-pointer mt-2 rounded-lg px-4 py-2 text-black ${selectedId === template.id ? "bg-blue-100" : ""
                  }`}
              >
                <span
                  className={`${selectedId === template.id
                    ? "text-blue-700 font-semibold text-lg hover:text-xl"
                    : "text-black hover:text-teal-700 text-md font-medium"
                    }`}
                >
                  {template.name}
                </span>
                <CiEdit
                  onClick={() => {
                    setEditModal(true);
                    setEditId(template.id);
                  }}
                  className="mx-auto text-blue-600 hover:text-blue-700 text-xl cursor-pointer"
                />
                <MdDelete
                  onClick={() => {
                    setRemoveModal(true);
                    setRemoveId(template.id);
                  }}
                  className="mx-auto text-red-500 hover:text-red-600 text-xl cursor-pointer"
                />
              </p>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-center">
              <div className="rounded-sm">
                {data &&
                  Array.from({ length: data.pageCount }).map((_, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={imageNames[index] || ""}
                        onChange={(e) =>
                          handleImageNameChange(index, e.target.value)
                        }
                        required
                        placeholder={
                          data.pageCount === 1
                            ? "image name"
                            : `${index === 0 ? "first" : "second"} image name`
                        }
                        className="input rounded text-center mb-5 py-1 border-2 border-blue-500 shadow shadow-blue-200 focus:outline-none focus:border-blue-700 placeholder-gray-400"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className="mx-auto max-w-xl border-2 px-28 mt-5 text-center shadow-md pb-5"
          style={{ borderColor: "skyblue", borderRadius: "60px" }}
        >
          <img
            src={UploadFile}
            alt="uploadIcon"
            width={"25%"}
            className="mx-auto mt-5 pt-3 mb-4"
          />
          <h2 className="text-xl font-semibold text-white mb-4 mt-5">
            Drag and Drop file to upload <br /> or{" "}
          </h2>
          <div className="relative flex justify-center">
            <label
              className="flex items-center font-medium text-white bg-blue-500 rounded-3xl shadow-md cursor-pointer select-none text-lg px-6 py-2 hover:shadow-xl active:shadow-md"
              htmlFor="file-upload"
            >
              <span>Upload CSV File: {csvFile?.name}</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx"
              name="file"
              onChange={onCsvFileHandler}
              className="absolute -top-full opacity-0"
            />
          </div>
          <p className="text-white font-medium my-3">Supported files: xlsx</p>
        </div>
        {/* 2nd section */}
        <div
          className="mx-auto max-w-xl border-2 px-28 mt-5 text-center shadow-md pb-5"
          style={{ borderColor: "skyblue", borderRadius: "60px" }}
        >
          <img
            src={UploadFile}
            alt="uploadIcon"
            width={"25%"}
            className="mx-auto mt-5 pt-3 mb-4"
          />

          <h2 className="text-xl font-semibold text-white mb-4 mt-5">
            Drag and Drop file to upload <br /> or{" "}
          </h2>
          <div className="relative flex justify-center">
            <label
              className="flex items-center font-medium text-white bg-blue-500 rounded-3xl shadow-md cursor-pointer select-none text-lg px-6 py-2 hover:shadow-xl active:shadow-md"
              htmlFor="image-folder-upload"
            >
              <span>Upload Zip file: {imageFolder?.name}</span>

              <input
                id="image-folder-upload"
                type="file"
                accept=".zip,.folder,.rar"
                multiple
                name="file"
                onChange={onImageFolderHandler}
                className="absolute -top-full opacity-0"
              />
            </label>
          </div>
          <p className="text-white font-medium my-3">Supported files: .zip</p>
        </div>
      </div>
      <div className="my-6 w-full flex justify-center">
        <button
          type="submit"
          onClick={onSaveFilesHandler}
          className="bg-teal-600 px-8 text-white py-3 text-xl font-medium rounded-3xl"
        >
          Save Files
        </button>
      </div>
    </div>

  );
};

export default UploadSection;
