import React from 'react'
import { Link } from 'react-router-dom'

const TaskDetails = ({ onBackGroundClickHandler, renderTableRows, setCurrentPage, currentPage, totalPages }) => {
    return (
        <div
            id="modalBackground"
            className="flex justify-center items-center"
            onClick={onBackGroundClickHandler}
        >
            <div
                role="alert"
                className="rounded-xl border border-gray-100 bg-white p-12"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between p-4">
                    <h1 className="block text-gray-900 text-3xl font-semibold">
                        All Tasks
                    </h1>
                    <Link to={"/all-user"}
                        className="px-8 py-2 bg-blue-500 mr-4 text-white rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Back
                    </Link>
                </div>
                <div className=" rounded-xl my-6">
                    <div className="rounded-lg ">
                        <div className="inline-block align-middle md:px-6 py-4 px-16">
                            <div className=" border border-gray-200 md:rounded-lg">
                                <div className="divide-y divide-gray-200 py-4 px-8">
                                    <div className="bg-gray-50 w-full">
                                        <div className="flex">
                                            <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                                                <span>SN.</span>
                                            </div>
                                            <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                                                Min
                                            </div>
                                            <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                                                Max
                                            </div>
                                            <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                                                Module
                                            </div>
                                            <div className=" py-3.5 px-4 text-center text-xl font-semibold text-gray-700 w-[150px]">
                                                Status
                                            </div>
                                            <div className=" px-4 py-3.5 text-center text-xl font-semibold text-gray-700 w-[150px]">
                                                UpdatedDetails
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-200 bg-white overflow-y-auto max-h-[300px]">
                                        {renderTableRows()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-b-lg border-gray-200">
                            <ol className="flex justify-end gap-1 text-xs font-medium">
                                <li>
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <span className="sr-only">Prev Page</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </li>

                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`block size-8 rounded border border-gray-100 bg-white text-center leading-8 ${currentPage === index + 1
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-900"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                                <li>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <span className="sr-only">Next Page</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default TaskDetails