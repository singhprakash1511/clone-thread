import React, { useEffect, useState } from 'react'
import  axios  from 'axios'
import { useDispatch, useSelector } from "react-redux"
import toast from 'react-hot-toast'
import { useRef } from 'react'
import { setUser } from '../Redux/Slices/userSlice'


const UpdateProfile = () => {
    const {token} = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const userId = token?.user?._id || token?.newUser?._id;

    const [loading,setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(null);

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0]

        if(file){
            setImageFile(file);
            previewFile(file)
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }

    const [formData, setFormData] =useState({
        name: token.user?.name || token.newUser?.name,
		username: token.user?.username || token.newUser?.username,
		email: token.user?.email || token.newUser?.email,
		bio: token.user?.bio || token.newUser?.bio,
    })  
  
    const submitProfileForm = async (e) => {
        e.preventDefault();
        if(loading) return;
        setLoading(true)
        try {
            const formDataToSend ={
                name: formData.name,
                username: formData.username,
                email: formData.email,
                bio: formData.bio
            }

            const res = await axios.post(`/api/users/update/${userId}`,formDataToSend);
            const data = res.data;

            if(data.error){
                toast.error(data.message)
            }
            toast.success(data.message);
            dispatch(setUser({...data.user}));
            setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } 
      }

      useEffect( () => {
        if(imageFile) {
            previewFile(imageFile)
        }
      },[imageFile])
  return (
    <div className='flex items-start  justify-center flex-col gap-3 w-[40%]  px-2 m-auto mt-10 rounded-lg bg-gray-200'>
        <form className='w-[90%] m-auto flex items-center justify-center flex-col gap-4'>
        <h1 className='py-3 px-5 text-3xl font-bold'>Edit Profile</h1>
        <div className='flex w-[90%] m-auto items-center justify-center gap-5 px-5'>
            <div className='w-[35%] rounded-full'>
            <img src={token?.user?.profilePic || previewSource} alt="profile" 
                    className="w-[90px]  rounded-full h-[90px]"/>
            </div>
            <button onClick={ () => fileInputRef.current.click()} className='bg-gray-300 w-[65%] py-1 font-medium rounded-md'>Change Photo</button>
            <input type="file"
            ref={fileInputRef}
            className='hidden' onChange={handleFileChange}
            accept="image/png, image/gif, image/jpeg"
            />
        </div>
            <label className='w-full px-4 flex flex-col gap-1'>
                <p className='text-lg font-medium '>Full name<sup className='text-lg font-bold text-red-800'>*</sup> </p>
                <input type="text" 
                placeholder='Full Name'
                value={formData.name}
                onChange={(e) => setFormData({...formData, name:e.target.value})}
                className='w-full outline-none py-[6px] px-2 rounded-md '
                />
            </label>

            <label className='w-full px-4 flex flex-col gap-1'>
                <p className='text-lg font-medium '>User name<sup className='text-lg font-bold text-red-800'>*</sup> </p>
                <input type="text" 
               value={formData.username}
               onChange={(e) => setFormData({...formData, username:e.target.value})}
                placeholder='UserName'
                className='w-full outline-none py-[6px] px-2 rounded-md '
                />
            </label>

            <label className='w-full px-4 flex flex-col gap-1'>
                <p className='text-lg font-medium '>Email Address<sup className='text-lg font-bold text-red-800'>*</sup> </p>
                <input type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email:e.target.value})}
                className='w-full outline-none py-[6px] px-2 rounded-md '
                />
            </label>

                <label className='w-full px-4 flex flex-col gap-1'>
                <p className='text-lg font-medium '>Bio<sup className='text-lg font-bold text-red-800'>*</sup> </p>
                <input type="text" 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio:e.target.value})}
                placeholder='Bio'
                className='w-full outline-none py-[6px] px-2 rounded-md '
                />
            </label>

            <div className='my-4 m-auto w-[90%] flex gap-2 '>
            <button className='bg-red-500 w-[50%] py-1 font-medium rounded-md'>Cancel</button>
            <button onClick={submitProfileForm} className='w-[50%] py-1 rounded-md font-medium  bg-green-400'>Update</button>
            </div>
        </form>
        
    </div>
  )
}

export default UpdateProfile
