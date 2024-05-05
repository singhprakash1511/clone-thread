import React from 'react'
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../Redux/Slices/userSlice';
import  axios  from 'axios';
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom'; 

const Logout = ({setIsOpen}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const clickHandler = async () => {
        try {
            //fetching data from backend
            const res = await axios.post('/api/users/logout')
            const data =  res.data;

            if(data.error){
                toast.error("Error")
            }else{
                localStorage.removeItem("token")
                toast.success(data.message);
                setIsOpen(false);
                dispatch(setUser(null));
                dispatch(setToken(null));
                navigate('/auth'); // Navigate to auth page after successful logout
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
        <button onClick={clickHandler}>Logout</button>
    </div>
  )
}

export default Logout
