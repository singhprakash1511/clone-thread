import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast'
import Spinner from '../Spinner/Spinner';
import Post from '../components/Post';
import { setPost } from '../Redux/Slices/postSlices';
import useGetUserProfile from '../hooks/useGetUserProfile';

const UserPage = () => {
  const dispatch = useDispatch();
  const {user, loading} = useGetUserProfile();
  const {username} = useParams()
  const {posts} = useSelector((state) => state.post)
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect( () => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await axios.get(`/api/posts/user/${username}`);
        const data = res.data;
        
        dispatch(setPost(data));
        setFetchingPosts(false);
      } catch (error) {
        toast.error(error.message)
        setPost([ ]);
      }
    }

    getPosts();
  }, [username,setPost, dispatch]);

  if(!user && loading){
    return (
      <Spinner />
    )
  } 

  if(!user && !loading){
    return (
      <div className="flex justify-center items-center">
          <p>User Not Found</p>
        </div>
    )
  }
  return (
    <div className='flex flex-col gap-[10px] w-[600px] m-auto'>
        <UserHeader user={user}/>
        <div>
        {fetchingPosts ? (<Spinner />) : posts.length > 0 ? (
          <div className='mb-8'>
             {posts.map((post) => (
              <Post key={post._id} post={post}/>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center mt-[80px]">
          <button className='border py-[5px] px-4 rounded-xl'>Start your first thread</button>
        </div>
        ) }
        </div>
    </div>
  )
}

export default UserPage
