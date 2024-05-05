import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios'

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {username} = useParams();

  useEffect( () => {
    const getUser = async() => {
        try {
          const res = await axios.get(`/api/users/profile/${username}`)
          const data = res.data;
          if(data.error){
            toast.error(data.message);
            return;
          };
          setUser(data);
          setLoading(false);
        } catch (error) {
          toast.error(error.response.data.message)
        }
      };

      getUser();
  }, [username])

  return {loading, user}
}

export default useGetUserProfile
