import React from 'react'
import { useSelector } from 'react-redux';

const Message = ({ownMessage, message}) => {
    const selectedConversations = useSelector((state) => state.selectedConversations)

  return (
    <div className={`flex gap-8 w-full ${ownMessage ? 'justify-end' : 'justify-start'}`}>
      {ownMessage ? (
        <div className=' flex gap-8 pr-4 text-[22px] py-3'>
            <p className='bg-blue-400 text-white px-3 py-1 rounded-lg'>{message.text}</p>
        </div>
      ): (
        <div className=' flex gap-5 pl-4 text-[22px] py-3'>
            <img src={selectedConversations.profilePic} alt="senderPic" className='w-[40px] h-[40px] rounded-full'/>
            <p className='bg-gray-200 px-3 py-1 rounded-lg'>{message.text}</p>
      </div>
      )}
    </div>
  )
}

export default Message
