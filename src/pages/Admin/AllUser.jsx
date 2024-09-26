import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { REACT_APP_IP, onGetVerifiedUserHandler } from "../../services/common";
import { onGetAllUsersHandler } from "../../services/common";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
export function AllUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const cancelButtonRef = useRef(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const token = JSON.parse(localStorage.getItem("userData"));
  const [currentUser, setCurrentUser] = useState(null);
  const [removeUserId, setRemoveUserId] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [taskType, setTaskType] = useState("ALL")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await onGetVerifiedUserHandler();
        setCurrentUser(response.user);
      } catch (error) { }
    };
    fetchUser();
  }, []);


  useEffect(() => {
    if (!confirmationModal) {
      setRemoveUserId("")
    }
  }, [setConfirmationModal, confirmationModal])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await onGetAllUsersHandler();
        const { users } = response;
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [updateSuccess]);

  const onModelHandler = async (user) => {
    if (currentUser?.role === "Moderator" || currentUser?.role === "Operator") {
      toast.warning("You don't have access to perform this operation.")
      return;
    }
    setOpen(true);
    setSelectedUser(user);
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      permissions: {
        ...prevUser.permissions,
        [name]: checked,
      },
    }));
  };

  const onUpdateHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://${REACT_APP_IP}:4000/users/updateuser/${selectedUser.id}`,
        { selectedUser },
        {
          headers: {
            token: token,
          },
        }
      );
      setOpen(false);
      setSelectedUser(null);
      setUpdateSuccess(!updateSuccess);
      toast.success("User Updated Successfully", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response.data, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (currentUser?.role === "Moderator" || currentUser?.role === "Operator") {
      toast.warning("You don't have access to perform this operation.")
      return;
    }
    try {
      if (+removeUserId === currentUser?.id) {
        toast.error("You cannot delete yourself.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        return;
      }
      await axios.post(
        `http://${REACT_APP_IP}:4000/users/deleteuser/${+removeUserId}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );
      setUsers(users.filter((user) => user.id !== +removeUserId));
      toast.success("User Deleted Successfully", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setConfirmationModal(false);
      setRemoveUserId("");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error in deleting user", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  const onUserDetailHandler = (id) => {
    navigate(`/user-detail/${id}`);
  };

  const onUserUpdatedDetailsHandler = (id) => {
    navigate(`/updated-details/${id}`);
  };


  const filteredUsers = taskType === "ALL"
    ? users
    : taskType === "admin"
      ? users?.filter(user => user?.role === "Admin")
      : taskType === "operator"
        ? users?.filter(user => user?.role === "Operator")
        : taskType === "moderator"
          ? users?.filter(user => user?.role === "Moderator")
          : users

  console.log(filteredUsers)



  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-20">
      <section className="md:mx-auto w-full max-w-7xl   px-12 py-10 bg-white rounded-xl">
        <div className="flex flex-col space-y-4  sm:flex-row md:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2 className="text-3xl font-semibold">All Users</h2>
          </div>
          {currentUser?.role === "Admin" &&
            <div>
              <button
                type="button"
                onClick={() => navigate("/create-user")}
                className="rounded-md  bg-indigo-600 hover:bg-indigo-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-3 py-2 text-sm  text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Add New User
              </button>
            </div>}
        </div>
        <div>
          <div className="hidden sm:block mt-4">
            <nav className="flex gap-6" aria-label="Tabs">
              <button
                onClick={() => setTaskType("All")}
                className={`shrink-0 rounded-lg p-2 text-sm border-2  font-medium ${taskType === "All" && "bg-sky-100 text-sky-600"} hover:bg-sky-100 hover:text-gray-700`}
              >
                ALL USERS
              </button>

              <button
                onClick={() => setTaskType("admin")}
                className={`shrink-0 rounded-lg p-2 text-sm border-2  font-medium ${taskType === "admin" && "bg-sky-100 text-sky-600"} hover:bg-sky-100 hover:text-gray-700`}
              >
                ADMIN
              </button>

              <button
                onClick={() => setTaskType("operator")}
                className={`shrink-0 border-2  rounded-lg ${taskType === "operator" && "bg-sky-100 text-sky-600"} p-2 text-sm font-medium hover:bg-sky-100`}
                aria-current="page"
              >
                OPERATOR
              </button>
              <button
                onClick={() => setTaskType("moderator")}
                className={`shrink-0 border-2  rounded-lg ${taskType === "moderator" && "bg-sky-100 text-sky-600"} p-2 text-sm font-medium hover:bg-sky-100`}
                aria-current="page"
              >
                MODERATOR
              </button>
            </nav>
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="bg-gray-50 ">
                    <tr>
                      <th
                        scope="col"
                        className="px-8 py-3.5 text-left text-md font-semibold text-gray-700"
                      >
                        <span>User</span>
                      </th>
                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left  text-md font-semibold text-gray-700"
                      >
                        User details
                      </th>
                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left  text-md font-semibold text-gray-700"
                      >
                        Updated details
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-left text-md font-semibold text-gray-700"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-md font-semibold text-gray-700"
                      >
                        Permissions
                      </th>
                      <th scope="col" className="relative px-4 py-3.5">
                        <span className="sr-only">Edit</span>
                      </th>
                      <th scope="col" className="relative px-4 py-3.5">
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white ">
                    {filteredUsers?.map((user, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.userName}
                              </div>
                              <div className="text-sm text-gray-700">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-12 py-4">
                          <div
                            onClick={() => onUserDetailHandler(user.id)}
                            className="text-sm text-gray-900 "
                          >
                            <button className="bg-indigo-500 shadow text-white px-3 py-1 rounded-3xl">
                              User detail
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-12 py-4">
                          <div
                            onClick={() => onUserUpdatedDetailsHandler(user.id)}
                            className="text-sm text-gray-900 "
                          >
                            <button className="bg-blue-500 shadow text-white px-3 py-1 rounded-3xl">
                              Updated detail
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-12 py-4">
                          <div className="text-sm font-semi bold text-gray-900 ">
                            {user.role}
                          </div>
                        </td>
                        <td className=" px-4 py-4 text-sm text-gray-700">
                          {user?.permissions &&
                            Object.entries(user.permissions)
                              .filter(([key, value]) => value === true)
                              .reduce((acc, [key]) => {
                                // Push permissions into sets of three
                                if (
                                  acc.length === 0 ||
                                  acc[acc.length - 1].length === 3
                                ) {
                                  acc.push([]);
                                }
                                acc[acc.length - 1].push(key);
                                return acc;
                              }, [])
                              .map((permissionSet, index) => (
                                <div key={index} className="flex">
                                  {permissionSet.map((key) => (
                                    <span
                                      key={key}
                                      className="rounded-full bg-green-100 px-2 py-1 text-sm font-semibold leading-5 my-1 text-green-700 mr-2"
                                    >
                                      {key}
                                    </span>
                                  ))}
                                </div>
                              ))}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right text-2xl font-medium">
                          <button>
                            <BiEdit
                              className=" text-blue-500"
                              onClick={() => onModelHandler(user)}
                            />
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right text-2xl font-semibold">
                          <Link to="#" className="text-red-600">
                            <RiDeleteBin6Line
                              onClick={() => {
                                setRemoveUserId(user.id)
                                setConfirmationModal(true)
                              }}
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
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
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-full overflow-y-auto">
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-3xl mx-4 bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full  md:max-w-xl lg:max-w-2xl">
                    <div className="bg-gray-50 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <form
                          onSubmit={onUpdateHandler}
                          className="px-4 py-4  sm:px-6 sm:pb-4"
                        >
                          <div className="sm:flex sm:items-start">
                            <div className=" text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <Dialog.Title
                                as="h1"
                                className=" font-semibold leading-6 text-gray-900 text-2xl"
                              >
                                Edit User
                              </Dialog.Title>
                              <div className="mt-6">
                                <div className="mb-5 flex gap-4">
                                  <label
                                    htmlFor="userName"
                                    className="block text-lg mt-2 w-[200px]  font-medium text-gray-700"
                                  >
                                    Username
                                  </label>
                                  <input
                                    type="text"
                                    name="userName"
                                    id="userName"
                                    value={selectedUser?.userName}
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        userName: e.target.value,
                                      })
                                    }
                                    className="mt-1 focus:ring-indigo-500  px-4 py-1 border-3 border-gray-100 shadow-blue-100 focus:border-indigo-500 block w-full shadow-md sm:text-sm  rounded-md"
                                  />
                                </div>
                                <div className="mb-5 flex gap-4">
                                  <label
                                    htmlFor="mobile"
                                    className="block text-lg mt-2 w-[200px] font-medium text-gray-700"
                                  >
                                    Mobile
                                  </label>
                                  <input
                                    type="text"
                                    name="mobile"
                                    id="mobile"
                                    maxLength={10}
                                    value={selectedUser?.mobile}
                                    onChange={(e) => {
                                      const newValue = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      );
                                      setSelectedUser({
                                        ...selectedUser,
                                        mobile: newValue,
                                      });
                                    }}
                                    className="mt-1 focus:ring-indigo-500 px-3 focus:border-indigo-500 block w-full shadow-md shadow-blue-100 sm:text-sm lg:text-md border-gray-300 rounded-md"
                                  />
                                </div>
                                <div className="mb-5 flex gap-4">
                                  <label
                                    htmlFor="email"
                                    className="block text-lg mt-2 w-[200px] font-medium text-gray-700"
                                  >
                                    Email
                                  </label>
                                  <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={selectedUser?.email}
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        email: e.target.value,
                                      })
                                    }
                                    className="mt-1 w-full px-3 py-1 focus:ring-indigo-500 lg:text-md focus:border-indigo-500 block shadow-md shadow-blue-100 sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                                <div className="mb-5 flex gap-4">
                                  <label
                                    htmlFor="password"
                                    className="block text-lg mt-2 w-[200px]  font-medium text-gray-700"
                                  >
                                    New Password
                                  </label>
                                  <input
                                    type="text"
                                    name="password"
                                    id="password"
                                    placeholder="change password"
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        password: e.target.value,
                                      })
                                    }
                                    className="mt-1 focus:ring-indigo-500  px-4 py-1 border-3 border-gray-100 shadow-blue-100 focus:border-indigo-500 block w-full shadow-md sm:text-sm  rounded-md"
                                  />
                                </div>
                                <div className="mb-5 flex gap-4">
                                  <label
                                    htmlFor="role"
                                    className="block w-[140px] text-lg mt-2 font-medium text-gray-700"
                                  >
                                    Role
                                  </label>
                                  <select
                                    id="role"
                                    name="role"
                                    required
                                    value={selectedUser?.role}
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        role: e.target.value,
                                      })
                                    }
                                    className="mt-1 block w-40 py-1 px-3 border  shadow-blue-100 bg-white rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
                                    <option selected disabled>
                                      Select role
                                    </option>
                                    <option value="Admin">Admin</option>
                                    <option value="Moderator">Moderator</option>
                                    <option value="Operator">Operator</option>
                                  </select>
                                </div>
                                <div className="mb-5 ">
                                  <label className="block text-left text-lg mb-2 font-medium text-gray-700">
                                    Permissions
                                  </label>
                                  <div className="flex gap-6 flex-wrap">
                                    {selectedUser?.permissions &&
                                      Object.entries(
                                        selectedUser?.permissions
                                      )?.map(([key, value]) => (
                                        <div
                                          key={key}
                                          className="flex items-center"
                                        >
                                          <input
                                            id={key}
                                            name={key}
                                            type="checkbox"
                                            checked={value}
                                            onChange={handlePermissionChange}
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                          />
                                          <label
                                            htmlFor={key}
                                            className="ml-2 block text-md text-gray-900 font-semibold"
                                          >
                                            {key}
                                          </label>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3  sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="submit"
                              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-blue-600 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={closeModal}
                              className="mt-3 inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                              ref={cancelButtonRef}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <ConfirmationModal
          confirmationModal={confirmationModal}
          onSubmitHandler={handleDeleteUser}
          setConfirmationModal={setConfirmationModal}
          heading="Delete User"
          message="Are you sure you want to remove the user?"
        />
      </section>
    </div>
  );
}
