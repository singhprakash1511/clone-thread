import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import Spinner from "../Spinner/Spinner"
import Message from './Message';
import toast from 'react-hot-toast';
import MessageInput from './MessageInput';

const MessageContainer = () => {
    const selectedConversations = useSelector((state) => state.selectedConversations);
    const {token} = useSelector((state) => state.user);
    const currUser = token.user;
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    
    useEffect( () =>{
        const getMessage =async () => {
            setLoadingMessages(true);
            setMessages([])
            try {
                const res = await axios.get(`/api/message/${selectedConversations.userId}`);
                const data = res.data;

                if(data.error){
                    toast.error(data.message);
                }

                setMessages(data);
                setLoadingMessages(false);
            } catch (error) {
                toast.error("Internal server error")
            }
        }
        getMessage();
    },[selectedConversations.userId])
  return (
    <div className='w-full h-full m-auto flex flex-col'>
        <div className='flex gap-3 items-center font-medium px-3 py-4'>
            <img src={selectedConversations.profilePic} alt="senderPic" className='w-[50px] h-[50px] rounded-full'/>
            <h3>{selectedConversations.username}</h3>
        </div>
        <hr />

        <div className='w-full h-full overflow-scroll overflow-x-hidden relative'>
           {loadingMessages && (
            <Spinner />
           )}

           {!loadingMessages && (
            messages.map((message) => (
                <Message key={message._id} message={message} ownMessage={currUser._id === message.sender}/>
            ))
           )}

        </div>
        <div className='w-full py-[2px] px-1'>
            <MessageInput setMessages={setMessages} />
        </div>
    </div>
  )
}

export default MessageContainer
