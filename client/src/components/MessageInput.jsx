import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setConversations } from '../Redux/Slices/messageSlice';

const MessageInput = ({setMessages}) => {
    const [messageText, setMessageText] = useState('');
    const selectedConversations = useSelector((state) => state.selectedConversations);
    const dispatch = useDispatch();

    const handlerSendMessage = async (e) => {
        e.preventDefault();
        if(!messageText) return;

        try {
            const res = await axios.post("/api/message/sendMessage",{
                message: messageText,
                recipientId: selectedConversations.userId
            })
            const data = res.data;
            console.log(data);
            if(data.error){
                toast.error(data.message);
            }
            setMessages((messages) => [...messages, data]);

            // dispatch(setConversations(prevConvs => {
            //   console.log("Previous Conversations:", prevConvs); // Log prevConvs to see its value
            //   const updatedConversations = prevConvs.map(conversation => {
            //     if(conversation._Id === selectedConversations.conversationId){
            //       return {
            //         ...conversation,
            //         lastMessage:{
            //           text:messageText,
            //           sender:data.sender,
            //         }
            //       }
            //     }
            //     return conversation;
            //   })
            //   return updatedConversations;
            // }))
            
            setMessageText('');
        } catch (error) {
            toast.error("Internal server error")
        }
    }
  return (
    <div className='cursor-pointer w-full flex items-center border px-2 py-2 rounded-lg'>
      <form onSubmit={handlerSendMessage} className='w-full px-3'>
       <input
       type='text'
       value={messageText}
       onChange={(e) => setMessageText(e.target.value)}
        placeholder="Type your message..."
        className='w-[95%] outline-none'
      />
        <button type='submit' className='cursor-pointer'>send</button>
      </form>
    </div>
  )
}

export default MessageInput
