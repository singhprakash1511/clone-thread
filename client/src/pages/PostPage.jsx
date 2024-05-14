import { MdVerified } from "react-icons/md"
import { Link } from "react-router-dom"
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import Spinner from "../Spinner/Spinner";
import {useParams} from 'react-router-dom'
import { useEffect, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

const PostPage = () => {
   const {user, loading} = useGetUserProfile();
   const [post, setPost] = useState(null);
   const {pid} = useParams(); 

   useEffect( () => {
    const getPost = async () => {
        try {
            const res = await axios.get(`/api/posts/${pid}`)
            const data = res.data;
            if(data.error){
                toast.error("data.error");
                return
            }
            setPost(data);

        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
    getPost();
   },[pid])

   if(!user && loading){
    return (
        <div className="flex items-center justify-center h-full">
            <Spinner />
        </div>
    )
   }

   if(!post) return null;

  return (
    <div className="mt-8 flex flex-col gap-3">
        <div className="flex gap-3 flex-col">
            <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                    <img src={user?.user.profilePic} alt="profile" 
                    loading="lazy"
                    className="w-[70px] rounded-full h-[70px]"
                    />
                    <Link to={"/markzuckerberg/post/1"}><h3 className="text-lg font-medium">{user?.user.username}</h3></Link>
                    <MdVerified className="text-blue-600 text-lg" />
                </div>
                <div className="flex gap-3 items-center">
                    <p>1d</p>
                    <BsThreeDots />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <p>{post?.post.text}</p>
               {post?.post.img && (
                 <div>
                 <img src={post?.post.img} alt="post" className="w-full h-[350px]  object-fit rounded-lg"/>
             </div>
               )}

         </div>
            <Actions size={28} post={post?.post} />
        </div>
        <hr />
        <div className="flex justify-between items-center">
            <p className="text-[20px] font-semibold"><span className="text-[30px]">👋</span>Get the app to like, reply and post.</p>
            <button className="bg-gray-600 px-2 py-1 text-white rounded-lg">
                Get
            </button>
        </div>
        <hr />
        <div>
            {post?.post.replies.map((reply,index) => (
                <Comment key={reply._id} 
                reply = {reply}
                isLastReply = {index === post.post.replies.length-1}
                />
            ))}
        </div>
    </div>
  )
}

export default PostPage
