import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from "../Spinner/Spinner"
import Message from './Message';
import toast from 'react-hot-toast';
import MessageInput from './MessageInput';
import { useSocket } from '../context/SocketContext';
import { setConversations } from '../Redux/Slices/messageSlice';

const MessageContainer = () => {
    const selectedConversations = useSelector((state) => state.selectedConversations);
    const {token} = useSelector((state) => state.user);
    const currUser = token.user;
    const {conversations} = useSelector((state) => state.conversations)
    const dispatch = useDispatch();
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const {socket} = useSocket();
    const messageEndRef = useRef(null);


    useEffect(() => {
        socket.on("newMessage",(message) =>{
            console.log(message)

            if(selectedConversations.conversationId === message._id){
                setMessages((prevMessages) => [...prevMessages, message]);
            }

            const updatedConversations = conversations.map(conversation => {
                if (conversation._id === selectedConversations.conversationId) {
                    return {
                        ...conversation,
                        lastMessage: {
                            text: message.text,
                            sender: message.sender,
                        }
                    };
                }
                return conversation;
            });

            dispatch(setConversations(updatedConversations));
        })

        return () => socket.off("newMessage");
    },[socket,selectedConversations.conversationId,dispatch,conversations]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);


    useEffect( () =>{
        const getMessage =async () => {
            setLoadingMessages(true);
            setMessages([])
            try {
                if (selectedConversations.mock){
                    setLoadingMessages(false);
                    return;
                }
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
    },[selectedConversations.userId, selectedConversations.mock])
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
                <div key={message._id}
                ref={messages.length -1 === messages.indexOf(message) ? messageEndRef : null}
                >
                <Message  message={message} ownMessage={currUser._id === message.sender}/>
                </div>
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
