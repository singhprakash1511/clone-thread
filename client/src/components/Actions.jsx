import React, { useState } from "react";
import { FaRegComment, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsSend } from "react-icons/bs";
import {useSelector,useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom';
import axios from "axios"
import toast from 'react-hot-toast'
import { setPost } from "../Redux/Slices/postSlices";
import CommentSection from "../pages/CommentSection";


const Actions = ({size, post}) => {
  const {token} = useSelector( (state) => state.user);
  const {posts} = useSelector( (state) => state.post);
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(token?.user?._id));
  const dispatch = useDispatch();
  const [isLiking,setIsLiking] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const commentHandler = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  const clickLikeHandler = async (e) => {
    e.preventDefault()
    if(!token){
      navigate('/auth');
    }
    if(isLiking) return;
    setIsLiking(true);

    try {
      const res = await axios.put("/api/posts/like/" + post._id)
      const data = res.data;
      if(data.error){
        toast.error(data.message)
      }
      if(!isLiked){
        //add current user id to likes array

        const updatePosts = posts.map( (p) => {
          if(p._id === post._id){
            return {...p, likes:[...p.likes, token?.user._id]}
          }
          return p;
        })
        dispatch(setPost(updatePosts));
      }else{
        //remove current user id from likes array
        setPost({...post, likes:post.likes.filter(id => id !== token?.user._id)})
        const updatePosts = posts.map( (p) => {
          if(p._id === post._id){
            return {...p, likes: p.likes.filter((id) => id !== token?.user._id)}
          }
          return p;
        })
        dispatch(setPost(updatePosts));
      }
      setIsLiked(!isLiked);
      setIsLiking(false);
    } catch (error) {
      toast.error("something went wrong")
    }


  }

  return (
  <div>
    <div className="flex gap-3 flex-col">
      <div className="flex items-center gap-4">
        <div onClick={clickLikeHandler}>
          {isLiked ? (
            <FaHeart className="text-red-500 mr-1 cursor-pointer" size={size} />
          ) : (
            <FaRegHeart className="text-black mr-1 cursor-pointer" size={size} />
          )}
        </div>
        <div>
          <FaRegComment size={size} onClick={commentHandler} className="cursor-pointer"/>
        </div>   
        <div>
          <BsSend size={size} />
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <p className="text-sm">{post?.likes?.length} likes</p>
        <div className="w-[4px] h-1 bg-gray-600 rounded-full"></div>
        <p className="text-sm">{post?.replies?.length} comments</p>
      </div>
      
    </div>

   <div>
        {isOpen && (
              <CommentSection post={post} setIsOpen={setIsOpen} />
          )}
   </div>
    </div>
  );
};

export default Actions;
