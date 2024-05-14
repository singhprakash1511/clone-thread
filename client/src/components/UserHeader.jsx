import React from "react";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import FollowersPage from "../pages/FollowersPage";

  const UserHeader = ({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useSelector((state) => state.user);
  const currUser = token?.newUser || token?.user;
  const [isFollowing, setIsFollowing] = useState(user?.user.followers.includes(currUser?._id));
  const [isLoading, setLoading] = useState(false);

 
  const followUnfollowHandler = async () => {
    if(!currUser){
      toast.error("Please login to follow")
    }

    if(isLoading) {
      setLoading(true);
    }
    try {
      const res = await axios.post(`/api/users/follow/${user?.user?._id}`);
      const data = res.data;

      if(data.error){
        toast.error(data.message);
        return;
      }

      if(isFollowing){
        toast.success(data.message);
        user?.user.followers.pop(currUser?._id)
      }else{
        toast.success(data.message);
        user?.user.followers.push(currUser?._id);
      }
      setIsFollowing(!isFollowing);
      setLoading(false);

    } catch (error) {
      toast.error("something went wrong")
    }
  }

  const editClickHandler = () => {
    navigate("/update");
  };

  return (
    <div className="flex flex-col mt-8 m-auto gap-8 py-5 w-full ">

      <div className="flex justify-between w-full items-start relative">

        <div className="flex flex-col gap-5">

          <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium capitalize">
            {user?.user?.name}
          </h1>
          <h5 className="text-base  lowercase">{user?.user?.username}</h5>
          </div>

          <div>
            <h3>{user?.user?.bio}</h3>
          </div>

          <div>
            <span className="text-gray-400 hover:underline cursor-pointer" onClick={() => setIsOpen(!isOpen)}>{user?.user?.followers.length} followers</span>
          </div>
          {isOpen && (
              <FollowersPage className="z-30" user={user}/>
          )}

        </div>

        <div className="absolute right-0 -top-14">
          <img
                      src={
                        user?.user?.profilePic ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${user?.user.name}`
                      }
                      alt="profile"
                      loading="lazy"
                      className="w-[90px] rounded-full h-[90px] my-10"
              />
        </div>

      </div>

      <div className="w-full">
          <div className="flex gap-3 w-full m-auto">
              {currUser?._id !== user?.user?._id && (
                <button onClick={followUnfollowHandler} className={`w-[50%] font-medium text-[16px] px-[14px] rounded-lg  py-[6px] ${
                  isFollowing ? 'bg-gray-200 hover:bg-gray-300 ' : 'bg-[#1876f2d0] hover:bg-[#1877F2] text-white'
                } ${isLoading ? (<Spinner/>) : ""}`}>
                 {isFollowing ? "unfollow" : "follow"}
              </button>
              )}

              {currUser?._id !== user?.user?._id && (
                <button className="w-[50%] border hover:bg-gray-300 font-medium text-[16px] px-[14px] rounded-lg  py-[6px]">
                  Message
                </button>
              )}
            </div>

            {currUser?._id === user?.user?._id && (
              <button
                onClick={editClickHandler}
                className="border hover:bg-gray-200 font-medium text-[16px] px-[14px] w-full rounded-lg  py-[6px]"
              >
                Edit Profile
              </button>
            )}
      </div>
      
      <div className="w-full flex ">
                <div className="border-b-2 flex flex-1 justify-center border-black cursor-pointer font-bold">
                    <h3>Threads</h3>
                </div>

                <div className="border-b-2 flex flex-1 justify-center cursor-pointer font-bold">
                    <h3>Replies</h3>
                </div>
      </div>
    </div>
  );
};

export default UserHeader;
