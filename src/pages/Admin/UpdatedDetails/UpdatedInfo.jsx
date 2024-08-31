import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UpdatedInfo = ({ updatedData, setOpenImage, setUpdatedImages, setImageDetails, setIsVisible }) => {
    return (
        <div className="overflow-x-auto rounded-3xl w-[800px] shadow-sm shadow-white">
            <div className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm w-full">
                <div className="px-4 py-8">
                    <div className="flex justify-between gap-4 p-4">
                        <h1 className="block text-gray-900 text-3xl font-semibold">
                            Updated Details
                        </h1>
                        <button
                            onClick={() => setIsVisible(true)}
                            className="px-8 py-2 bg-blue-500 mr-4 text-white rounded-lg shadow-md hover:bg-blue-600"
                        >
                            Back
                        </button>
                    </div>
                    <div className="mx-4 border-2 rounded-xl">
                        <div className="ltr:text-left rtl:text-right">
                            <div className="text-xl flex font-bold text-center">
                                <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/5">
                                    Key
                                </div>
                                <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/5">
                                    Row Index
                                </div>
                                <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/5">
                                    Updated Data
                                </div>
                                <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/5">
                                    Previous Data
                                </div>
                                <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/5">
                                    Status
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200 text-center overflow-y-auto h-[280px]">
                            {Array.from({ length: updatedData.rowIndex.length }).map(
                                (_, index) => {
                                    const updatedKeyData =
                                        updatedData?.updatedColumn[index]?.split(",") || [];
                                    const updatedCurrentData =
                                        updatedData?.currentData[index]?.split(",") || [];
                                    const previousData =
                                        updatedData?.previousData[index]?.split(",") || [];
                                    const images =
                                        updatedData?.imageNames[index]?.split(",") || [];
                                    const isUpdated = updatedData?.isVerified[index]
                                    const detailsId = updatedData?.updatedIds[index]
                                    return (
                                        <React.Fragment key={index}>
                                            {updatedKeyData.map((d, i) => (
                                                <div
                                                    onClick={() => {
                                                        setOpenImage(true)
                                                        setUpdatedImages(images[0]?.split("-*"));
                                                        setImageDetails((prev) => ({ ...prev, id: detailsId, index: index, isVerified: isUpdated }))
                                                    }}
                                                    key={i}
                                                    className={`flex border cursor-pointer ${i % 2 === 0 ? "odd:bg-blue-50" : ""
                                                        }`}
                                                >
                                                    <div className="flex whitespace-nowrap px-4 py-3 font-medium text-gray-900 w-1/5">
                                                        <div className="whitespace-nowrap px-4 py-3 text-gray-700 w-full">
                                                            {d}
                                                        </div>
                                                    </div>
                                                    <div className="whitespace-nowrap px-4 py-3 text-gray-700 w-1/5">
                                                        {updatedData?.rowIndex[index]}
                                                    </div>
                                                    <div className="whitespace-nowrap px-4 py-3 text-gray-700 w-1/5">
                                                        {updatedCurrentData[i]}
                                                    </div>
                                                    <div className="whitespace-nowrap px-4 py-3 text-gray-700 w-1/5">
                                                        {previousData[i]}
                                                    </div>
                                                    <div className="whitespace-nowrap px-4 py-3 text-gray-700 w-1/5 flex justify-center items-center">
                                                        {isUpdated ? (
                                                            <FaCheck className="text-green-500" />
                                                        ) : (
                                                            <FaTimes className="text-red-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    );
                                }
                            )}
                        </div>
                        <div className="flex justify-center py-4">
                            {/* {renderPageNumbers} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdatedInfo;
