import React, { useState } from 'react'
import Comment from '../components/Comment'
import Actions from '../components/Actions'
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';

const CommentSection = ({post_, setIsOpen}) => {
    const {token} = useSelector( (state) => state.user);
    const navigate = useNavigate();
    const [post, setPost] = useState(post_)
    const [reply, setReply] = useState("")
    const [isReplying, setIsReplying] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault();
        if(!token){
            navigate('/auth');
          }

          if(isReplying) return;
          setIsReplying(true);
          try {
            const res = await axios.put("/api/posts/reply/" + post._id,{
                text:reply
            })
            const data = res.data;
           if(data.success){
            toast.success(data.message)
            setPost({...post, reply:[...post.replies, data.reply]})
            setReply("")
            setIsOpen(false)
            setIsReplying(false);
           }
          } catch (error) {
            toast.error("something went wrong")
          }
    }

  return (
    <div className='bg-gray-200 relative p-5 flex flex-col gap-4 rounded-sm'>
        <div className='text-lg font-semibold px-3 border-b-2 border-black w-full py-3'>
            <h3>prakash1311</h3>
        </div>
        
        <div>
            <Comment/>
        </div>

        <div className='text-lg font-semibold px-3 border-t-2 border-black w-full py-3'>
            <form className='flex justify-between items-center' onSubmit={submitHandler}>
                <input type="text" 
                placeholder='Add a comment...'
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className='bg-gray-200 outline-none w-[90%]'
                />

                <button>post</button>
            </form>
        </div>

        <span className='absolute top-2 right-4'>
            <button>
            <RxCross2 size={30} onClick={() => {
                setIsOpen(false);
                setReply("")
            }}/>
            </button>
        </span>
    </div>
  )
}

export default CommentSection
