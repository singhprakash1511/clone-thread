import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast'
import { MdVerified } from "react-icons/md";
import Actions from "./Actions";
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { setPost } from '../Redux/Slices/postSlices';
import {formatDistanceToNow} from 'date-fns';


const Post = ({post}) => {
    const [user, setUser] = useState(null)
    const userId = post.postedBy;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.user); 
    const {posts} = useSelector((state) => state.post) 
    const currUser = token?.user

    const clickHandler = (e) => {
        e.preventDefault();
        navigate(`/${user?.user?.username}`)
    }
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get('/api/users/profile/' +userId);
                const data = res.data;
                if(data.error){
                    toast.error("error in fetching data");
                    return;
                }
                setUser(data);
            } catch (error) {
                toast.error(error.message);
                setUser(null);
            }
        };

        getUser();
    },[userId])

    const deleteHandler = async (e) => {
      try {
        e.preventDefault();
        if(!window.confirm("Are you sure you want to delete this post?")) return ;

        const res = await axios.delete(`/api/posts/${post._id}`)
        const data = res.data;

        toast.success(data.message);
        dispatch(setPost(posts.filter(p => p._id !== post._id)));

      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  return (
    <div className="w-full flex relative flex-col gap-5 ">
      <div className='flex'>
        
      <div className="flex gap-3 mb-3 py-5 w-[15%]">
        <div className="flex flex-col items-center">
         <img
            src={user?.user?.profilePic} alt='postPic'
            className="w-[45px] rounded-full h-[45px] cursor-pointer "
            onClick={clickHandler}
          />
        </div>
      </div>

      <div className="w-[85%] flex flex-col relative justify-center gap-4 mt-4 cursor-pointer" >
        <div className="flex justify-between  items-start">
          <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-1">
                <h3 className="text-lg font-medium cursor-pointer" onClick={clickHandler}>{user?.user?.username}</h3>
                <MdVerified className="text-blue-600 text-lg" />
            </div>

            <div onClick={ () =>navigate(`/${user?.user.username}/post/${post?._id}`)}>
                 <p>{post?.text}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center text-xl cursor-pointer" onClick={deleteHandler}>
            {currUser?._id === user?.user?._id && (
              <MdDelete />
            )}
          </div>
        </div>

        {post?.img && (
            <div>
                <img src={post?.img} alt="post" className="w-full h-[450px] rounded-lg object-fill"/>
            </div>
        )}

        <Actions post={post} size={22}/>
        <p className='text-[12px]'>{formatDistanceToNow(new Date(post?.createdAt))} ago</p>
      </div>
      </div>
       <hr />
    </div>
  )
}

export default Post
