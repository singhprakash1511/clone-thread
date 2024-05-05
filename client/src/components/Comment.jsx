import React from 'react'
import { BsThreeDots } from "react-icons/bs";

const Comment = ({reply, isLastReply}) => {
    
  return (
    <div className='flex flex-col gap-5 '>
        <div  className='w-full flex gap-2 my-2 px-2'>
        <div className='w-[10%]'>
                    <img src={reply?.userProfilePic} alt="profile" 
                    className="w-[50px] rounded-full h-[50px]"
                    />
        </div>

        <div className='w-[90%] flex flex-col gap-2'>
            <div className='flex items-start justify-between '>
                <div className='flex flex-col gap-1'>
                    <h3 className='text-lg font-semibold'>{reply?.username}</h3>
                    <p className='text-sm font-medium'>{reply?.text}</p>
                </div>

                <div className='flex gap-2 items-center'>
                    <p>1d</p>
                    <BsThreeDots className='cursor-pointer'/>
                </div>
            </div>
        {isLastReply && <hr/>}
        </div>
        </div>
    </div>
  )
}

export default Comment
