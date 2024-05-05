import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from  'axios'
import Spinner from '../Spinner/Spinner';
import Post from '../components/Post';

const HomePage = () => {
  const [posts, setPosts] = useState([ ]);
  const [isLoading, setIsLoading] =useState(true);

  useEffect( () => {
    const getFeedPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/posts/feed")
        const data = res.data;
    
        if(data.error){
          toast.error("No post found")
        }
        setIsLoading(false);
        setPosts(data);
        
      } catch (error) {
        toast.error(error.message);
      }
    }
    getFeedPosts();
  },[])
  return (
    <div className=' w-[600px] m-auto mt-2'>
        {isLoading ? (<Spinner />) : posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <Post key={post._id} post={post}/>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
          <p>No Posts yet</p>
        </div>
        )}
    </div>
  )
}

export default HomePage
