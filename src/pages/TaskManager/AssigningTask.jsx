import React from "react";

const AssigningTask = ({
  allUsers,
  setSelectedUser,
  selectedUser,
  taskValue,
  setTaskValue,
  onTaskAssignedHandler,
  totalData,
}) => {
  const handleCheckboxChange = (userId, userName) => {
    const existingIndex = selectedUser.findIndex(
      (data) => data.userId === userId
    );

    if (existingIndex !== -1) {
      const filteredData = [...selectedUser];
      filteredData.splice(existingIndex, 1);
      setSelectedUser(filteredData);
    } else {
      setSelectedUser((prev) => [
        ...prev,
        { userId: userId, userName: userName },
      ]);
    }
  };


  return (
    <>
      <div className="flex  space-y-4  flex-row items-center justify-between">
        <div className="">
          <h2 className="text-3xl font-semibold">Assign Tasks</h2>
        </div>
        <article className="rounded-xl bg-white p-2 ring ring-indigo-50  lg:p-4">
          <div className="flex items-start sm:gap-8">
            <div className="flex gap-3">
              <h1 className="rounded border border-indigo-500 bg-indigo-500 px-3 py-2 font-medium text-white">
                Total Data - {totalData}
              </h1>
            </div>
          </div>
        </article>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="-mx-4 -my-2  sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-x-auto border border-gray-200 md:rounded-lg ">
              <table className="w-full divide-y divide-gray-200 ">
                <thead className="bg-gray-50 ">
                  <tr>
                    <th
                      scope="col"
                      className="px-12 py-3.5 text-left text-xl font-semibold text-gray-700"
                    >
                      <span>Users</span>
                    </th>

                    <th
                      scope="col"
                      className="px-12 py-3.5 text-left  text-xl font-semibold text-gray-700"
                    >
                      Min
                    </th>

                    <th
                      scope="col"
                      className="px-12 py-3.5 text-left text-xl font-semibold text-gray-700"
                    >
                      Max
                    </th>
                    <th
                      scope="col"
                      className="px-12 py-3.5 text-left text-xl font-semibold text-gray-700"
                    >
                      Task
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-4 border-2">
                      <div className="flex items-center">
                        <div className=" w-full">
                          <div className="overflow-y-auto h-[310px]">
                            {allUsers?.map((user, i) => {
                              if (user.role !== "Admin") {
                                return (
                                  <div
                                    key={user.id}
                                    className="group flex items-center justify-between mt-2 rounded-lg hover:bg-blue-200 hover:text-black w-full bg-blue-100 px-4 py-2 text-gray-700"
                                  >
                                    <label
                                      htmlFor={`userId-${user.id}`}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={selectedUser.some(
                                          (data) => data.userId === user.id
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            user.id,
                                            user.userName
                                          )
                                        }
                                        id={`userId-${user.id}`}
                                        className="form-checkbox h-4 w-4 text-blue-500"
                                      />
                                      <span className="ml-2 text-md font-medium">
                                        {user.userName}
                                      </span>
                                    </label>
                                  </div>
                                );
                              } else {
                                return null;
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-12 py-4">
                      <div className="text-2xl text-gray-900 ">
                        <input
                          type="number"
                          min="1"
                          value={taskValue.min}
                          readOnly
                          id="Line3Qty"
                          className="h-10 w-16 rounded border-gray-400 bg-gray-200 p-0 text-center text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-12 py-4">
                      <div className="text-2xl text-gray-900">
                        <input
                          type="number"
                          id="Line3Qty"
                          value={taskValue.max}
                          onChange={(e) =>
                            setTaskValue({
                              ...taskValue,
                              max: e.target.value,
                            })
                          }
                          className="h-10 w-16 rounded border-gray-400 bg-gray-200 p-0 text-center text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-12 py-4">
                      <button
                        onClick={onTaskAssignedHandler}
                        className="rounded-3xl border border-indigo-500 bg-indigo-500 px-4 py-1 font-semibold text-white"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssigningTask;
