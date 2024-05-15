import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector, useDispatch} from 'react-redux';
import { setConversations } from '../Redux/Slices/messageSlice';

const MessageInput = ({setMessages}) => {
    const [messageText, setMessageText] = useState('');
    const dispatch = useDispatch();
    const selectedConversations = useSelector((state) => state.selectedConversations);
    const {conversations} = useSelector((state) => state.conversations)

    const handlerSendMessage = async (e) => {
        e.preventDefault();
        if(!messageText) return;

        try {
            const res = await axios.post("/api/message/sendMessage",{
                message: messageText,
                recipientId: selectedConversations.userId
            })
            const data = res.data;
            if(data.error){
                toast.error(data.message);
            }
            setMessages((messages) => [...messages, data]);
            const updatedConversations = conversations.map(conversation => {
              if (conversation._id === selectedConversations.conversationId) {
                  return {
                      ...conversation,
                      lastMessage: {
                          text: messageText,
                          sender: data.sender,
                      }
                  };
              }
              return conversation;
          });

          dispatch(setConversations(updatedConversations));

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
       onChange={(e) =>{ e.preventDefault(); setMessageText(e.target.value)}}
        placeholder="Type your message..."
        className='w-[95%] outline-none'
      />
        <button type='submit' className='cursor-pointer'>send</button>
      </form>
    </div>
  )
}

export default MessageInput
