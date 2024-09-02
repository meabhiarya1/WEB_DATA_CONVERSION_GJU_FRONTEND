import React, { useEffect, useState } from "react";
import { BiSolidUserPin } from "react-icons/bi";
import { onGetVerifiedUserHandler } from "../../services/common";

const Profile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const user = async () => {
      try {
        const profile = await onGetVerifiedUserHandler();
        setUser(profile.user);
      } catch (error) {
        console.error("Error in fetching user:", error);
      }
    };
    user();
  }, []);


  return (
    <div className=" flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-20">
      <div className="bg-white w-4/6 lg:w-1/2 xl:w-1/3 rounded-3xl py-8 px-8 shadow-md">
        <h1 className="px-6 py-2 text-3xl font-semibold flex items-center ">
          <BiSolidUserPin className="mt-1 me-2 text-blue-600" /> Profile
        </h1>
        <div className="flow-root px-4 py-3 mb-3 shadow-sm">
          <dl className="-my-3 divide-y divide-gray-100 text-lg">
            <div className="grid grid-cols-1 gap-1 p-4 even:bg-gray-50 sm:grid-cols-3 sm:gap-1">
              <dt className="font-medium text-gray-900">User Name</dt>
              <dd className="text-gray-700 sm:col-span-2">{user.userName}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-4 even:bg-gray-50 sm:grid-cols-3 sm:gap-1">
              <dt className="font-medium text-gray-900">Email</dt>
              <dd className="text-gray-700 sm:col-span-2">{user.email}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-4 even:bg-gray-50 sm:grid-cols-3 sm:gap-1">
              <dt className="font-medium text-gray-900">Mobile </dt>
              <dd className="text-gray-700 sm:col-span-2">{user.mobile}</dd>
            </div>

            <div className="grid grid-cols-1 gap-1 p-4 even:bg-gray-50 sm:grid-cols-3 sm:gap-1">
              <dt className="font-medium text-gray-900">Role</dt>
              <dd className="text-gray-700 sm:col-span-2">{user.role}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
