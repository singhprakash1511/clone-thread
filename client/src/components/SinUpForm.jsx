import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import { useDispatch} from 'react-redux';
import { setAuthStatus } from '../Redux/Slices/authSlice';
import { setToken, setUser } from '../Redux/Slices/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const SinUpForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name:"",
        lastName:"",
        username:"",
        email:"",
        password:""
    })

    const changeHandler = (e) => {
        setFormData( (formData) => ({
            ...formData,
            [e.target.name]:e.target.value
        }))
    }

    const clickHandler = () => {
        dispatch(setAuthStatus("login"))
    }

    const submitHandler = async (e) => {
        e.preventDefault()
       try {
        const res = await axios.post('/api/users/signup',{...formData})
        const data =  res.data;
      
       // Check if response data is not valid
       if (!data.success) {
        toast.error(data.message);
        }
         
        //Display success message
        toast.success(data.message)
        //store user data in localStorage
        localStorage.setItem("token", JSON.stringify(data))
        dispatch(setToken(data.token));
        const userImage =  data?.newUser?.profilePic? data.newUser.image : `https://api.dicebear.com/5.x/initials/svg?seed=${data.newUser.name}`
        dispatch(setUser({...data.newUser,profilePic:userImage}));
        navigate("/")
       } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
       }
    }

    

  return (
    <div className="w-[60%] m-auto pt-4 pb-3 mt-10 bg-gray-200 rounded-lg flex flex-col gap-8">
        <form onSubmit={submitHandler} className="w-full flex flex-col justify-center items-center gap-6 py-5  ">

            <div  className="flex justify-center items-center w-full gap-3 fullName px-[22px]">
                <label className='w-[50%]'>
                    <p className="text-[1.4rem] mb-[0.2rem] leading[1.375rem]">First Name<sup className="text-pink-500 font-extrabold">*</sup></p>
                    <input type="text" 
                    required
                    name='name'
                    value={formData.name}
                    onChange={changeHandler}
                    placeholder='first name'
                    className="bg-gray-50 text-lg outline-none w-full p-[10px] rounded-[0.5rem]"
                    />
                </label>

                <label className='w-[50%]'>
                    <p className="text-[1.4rem] mb-[0.2rem] leading[1.375rem]">Last Name</p>
                    <input type="text" 
                    required
                    name='lastName'
                    value={formData.lastName}
                    onChange={changeHandler}
                    placeholder='last name'
                    className="bg-gray-50 text-lg outline-none w-full p-[10px] rounded-[0.5rem]"
                    />
                </label>
            </div>

                <label className="w-full px-5">
                    <p className="text-[1.4rem] mb-[0.2rem] leading[1.375rem]">Username<sup className="text-pink-500 font-extrabold">*</sup></p>
                    <input type="text" 
                    required
                    name='username'
                    value={formData.username}
                    onChange={changeHandler}
                    placeholder='Enter Email Address'
                    className="bg-gray-50 text-lg outline-none w-full p-[10px] rounded-[0.5rem] "
                    />
                </label>

                <label className="w-full px-5">
                    <p className="text-[1.4rem] mb-[0.2rem] leading[1.375rem]">Email Address<sup className="text-pink-500 font-extrabold">*</sup></p>
                    <input type="email" 
                    required
                    name='email'
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder='Enter Email Address'
                    className="bg-gray-50 text-lg outline-none w-full p-[10px] rounded-[0.5rem] "
                    />
                </label>

                <label className="w-full px-5 relative">
                    <p className="text-[1.4rem] mb-[0.2rem] leading[1.375rem]">Password<sup className="text-pink-500 font-extrabold">*</sup></p>
                    <input type={showPassword ? "text" : "password"}
                    required
                    name='password'
                    value={formData.password}
                    onChange={changeHandler}
                    placeholder='Enter Password'
                    className="bg-gray-50 text-lg outline-none w-full p-[10px] rounded-[0.5rem] "
                    />
                    <span onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-[6%] top-[59%] text-[1.2rem] cursor-pointer">
                        {
                            showPassword ? <AiFillEye /> : <AiFillEyeInvisible />
                        }
                    </span>
                </label>

            <div className="w-full px-5 mt-6">
          <button  className="w-full border border-black p-[10px] rounded-[0.5rem] text-[1.2rem] bg-slate-700 text-white ">
            Create Account
          </button>
        </div>
        </form>

        <div className='flex items-center justify-center text-base font-semibold gap-1'>
           <p>Already have an account? </p>  
           <button onClick={clickHandler} className='text-blue-900 font-bold'>Login</button>
        </div>
    </div>
  )
}

export default SinUpForm
