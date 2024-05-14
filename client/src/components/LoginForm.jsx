import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch } from 'react-redux';
import { setAuthStatus } from '../Redux/Slices/authSlice';
import toast from "react-hot-toast"
import  axios  from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { setToken, setUser } from '../Redux/Slices/userSlice';


const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username:"",
        password:""
    })

    const changeHandler = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [event.target.name] : event.target.value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/users/login', {...formData});
            const data = res.data;

                // Check if response data is not valid
                if (!data.success) {
                    toast.error("Login failed. Please try again.");
                } 
                // Display success message
                toast.success(data.message);
                // Store user data in localStorage
                localStorage.setItem("token", JSON.stringify(data));
                dispatch(setToken(data.token));
                const userImage =  data?.user?.profilePic? data.user.image : `https://api.dicebear.com/5.x/initials/svg?seed=${data.user.name}`
                dispatch(setUser({...data.user, profilePic:userImage}));
                navigate("/");
        } catch (error) {
            toast.error(error.response.statusText)
        }
    }

    const clickHandler = () => {
        dispatch(setAuthStatus('signup'));
    }

  
  return (
    <div className='w-[50%] m-auto flex flex-col items-center justify-center px-3 py-5 gap-5 bg-gray-200 mt-10 rounded-lg'>
        <form onSubmit={submitHandler} className='w-full flex gap-6 flex-col justify-center items-center my-7'>
            <label className='w-full px-5 flex flex-col gap-4'>
                <p className='text-[1.6rem] mb-1 leading[1.375rem]  title'>Enter Username<sup className='text-pink-500 font-extrabold'>*</sup></p>
                <input type="text"
                required
                name='username'
                value={formData.username}
                onChange={changeHandler} 
                placeholder='username'
                className='text-black text-lg outline-none w-full p-[12px] rounded-[0.5rem] bg-gray-50'
                />
            </label>

            <label className='w-full px-5 relative flex flex-col gap-4'>
            <p className='text-[1.6rem] mb-1 leading[1.375rem] title'>Password<sup className='text-pink-500 font-extrabold'>*</sup></p>
                <input type={showPassword ? "text" : "password"}
                required
                name='password'
                value={formData.password}
                onChange={changeHandler} 
                placeholder='Enter Password'
                className='outline-none w-full p-[12px] rounded-[0.5rem] bg-gray-50 text-black text-lg '/>
                <span onClick={() =>setShowPassword((prev) => !prev) }
            className='absolute right-[8%] top-[69%]  text-[1.2rem] cursor-pointer '>
                {
                    showPassword ? <AiFillEye /> : <AiFillEyeInvisible />
                }
            </span>
            </label>

            <div className='w-full px-5 mt-6'>
            <button className='w-full border border-black p-[10px] rounded-[0.5rem] text-[1.2rem] bg-slate-700 text-white '>
                Log in
            </button>
        </div>
        </form>

        <div className='flex items-center justify-center text-base font-semibold gap-1'>
            <p>Don't have an account?</p>
            <button onClick={clickHandler}  className='text-blue-900 font-bold '>Sign up</button>
        </div>
    </div>
  )
}

export default LoginForm
