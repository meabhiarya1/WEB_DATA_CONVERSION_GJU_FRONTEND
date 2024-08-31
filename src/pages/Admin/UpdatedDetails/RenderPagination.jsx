import React from 'react'

const RenderPagination = ({ setCurrentPage, currentPage, totalPages }) => {
    return (
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
    )
}

export default RenderPagination
