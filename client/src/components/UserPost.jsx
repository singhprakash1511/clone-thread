import React from "react";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import Actions from "./Actions";

const UserPost = () => {
  return (
    <div className="w-full flex relative ">
      <div className="flex gap-3 mb-3 py-5 w-[15%]">
        <div className="flex flex-col items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg"
            alt="profile"
            className="w-[60px] rounded-full h-[60px] "
          />
        </div>

        <div></div>
      </div>

      <div className="w-[85%] flex flex-col relative justify-center gap-4 mt-4">
        <div className="flex justify-between  items-start">
          <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-1">
                <Link to={"/markzuckerberg/post/1"}><h3 className="text-lg font-medium">markzuckerberg</h3></Link>
                <MdVerified className="text-blue-600 text-lg" />
            </div>

            <div>
                 <p>This is my first post</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <p>1d</p>
            <BsThreeDots />
          </div>
        </div>

        <div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg" alt="post" className="w-full h-[350px]  object-fill"/>
        </div>

        <Actions />
      </div>
    </div>
  );
};

export default UserPost;
