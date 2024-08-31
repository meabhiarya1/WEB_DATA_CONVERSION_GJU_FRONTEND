import React, { useState } from "react";

const TaskEdit = ({ taskEdit, setTaskEdit, allUsers, onEditTaskHandler }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div>
      {taskEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8 max-w-lg mx-auto transform transition-all">
            <div className="flex items-center gap-4">
              <span className="shrink-0 rounded-full bg-blue-400 p-2 text-white">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                    fillRule="evenodd"
                  />
                </svg>
              </span>

              <p className="font-medium sm:text-lg">Select Users</p>
            </div>

            {/* User Selection Dropdown */}
            <div className="mt-4  w-[400px]">
              <select
                id="userSelect"
                onChange={(e) => {
                  const selectedEmail = e.target.value;
                  const userData = allUsers.find(
                    (user) => user.email === selectedEmail
                  );

                  setSelectedUser(userData);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                multiple
              >
                {allUsers.map((user) => {
                  if (user.role !== "Admin") {
                    return (
                      <option key={user.id} value={user.email}>
                        {user.email}
                      </option>
                    );
                  }
                })}
              </select>
            </div>

            {/* Selected Users Display */}
            {selectedUser && (
              <div id="selectedUsers" className="mt-6 space-y-2">
                <div className="p-2 rounded-lg bg-blue-200">
                  {selectedUser?.email}
                </div>
              </div>
            )}
            <div className="mt-6 sm:flex sm:gap-4">
              <button
                onClick={() => {
                  onEditTaskHandler(selectedUser);
                  setSelectedUser(null);
                }}
                className="inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-semibold text-white sm:w-auto hover:bg-blue-600 transition-colors duration-300"
              >
                Confirm Selection
              </button>

              <button
                onClick={() => {
                  setTaskEdit(false);
                  setSelectedUser(null);
                }}
                className="mt-2 inline-block w-full rounded-lg bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto hover:bg-gray-100 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskEdit;

// <div className="fixed z-50 inset-0 overflow-y-auto">
// <div className="flex items-center justify-center min-h-screen text-center sm:block">
//   {/* Background overlay */}
//   <div
//     className="fixed inset-0 bg-black opacity-50"
//     aria-hidden="true"
//   ></div>

//   <span
//     className="hidden sm:inline-block sm:align-middle sm:h-screen"
//     aria-hidden="true"
//   >
//     &#8203;
//   </span>

//   <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//     <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//       <div className="sm:flex sm:items-start">
//         <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//           <svg
//             onClick={() => setTaskEdit(false)}
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="h-6 w-6 text-red-600 cursor-pointer"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 18L18 6M6 6l12 12"
//             ></path>
//           </svg>
//         </div>
//         <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//           <h3
//             className="text-lg leading-6 font-medium text-gray-900"
//             id="modal-title"
//           >
//             Edit Task
//           </h3>
//           <div className="mt-2">
//             <p className="text-sm text-gray-500">
//               Assign this task to a user.
//             </p>
//             <div className="mt-4 max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-md shadow-inner">
//               {allUsers.map(
//                 (user) =>
//                   user.role !== "Admin" && (
//                     <div
//                       key={user.id}
//                       className="flex items-center justify-between p-2 border-b hover:bg-gray-100 rounded-md transition duration-150"
//                     >
//                       <div className="flex items-center">
//                         <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
//                           <FaRegUser className="text-gray-600" />
//                         </span>
//                         <div className="ml-3">
//                           <p className="font-medium text-gray-700">
//                             {user.userName}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {user.email}
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => onEditTaskHandler(user)}
//                         className="ml-2 inline-flex justify-center w-auto rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
//                       >
//                         Assign
//                       </button>
//                     </div>
//                   )
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="flex justify-end py-3 px-3 bg-gray-100">
//       <button
//         onClick={() => setTaskEdit(false)}
//         type="button"
//         className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//       >
//         Cancel
//       </button>
//     </div>
//   </div>
// </div>
// </div>
