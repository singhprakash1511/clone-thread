import React, { useEffect} from 'react'
import { IoIosSearch } from "react-icons/io";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {setConversations, setLoading, setError} from "../Redux/Slices/messageSlice";
import Conversation from '../components/Conversation';
import MessageContainer from '../components/MessageContainer';

const ChatPage = () => {
    const {conversations, loading} = useSelector((state) => state.conversations);
    const selectedConversations = useSelector((state) => state.selectedConversations)
    const dispatch = useDispatch();

    useEffect(() => {
        const getConversations = async () => {
            try {
                dispatch(setLoading(true));
                const res = await axios.get("/api/message/conversations");
                const data = res.data;

                if(data.error){
                    toast.error(data.message);
                    dispatch(setError(data.message));
                }

                dispatch(setConversations(data));
            } catch (error) {
                toast.error("Something went wrong");
                dispatch(setError("Something went wrong"));
                dispatch(setConversations([]));
            }
        }
        getConversations();
    },[dispatch])

  return (
    <div className='flex w-full h-[82%]'>
        <div className='w-[30%] flex flex-col gap-3'>
            <h1 className='text-lg font-bold'>Messages</h1>
            <form className='w-full flex gap-3'>
                <input type="search" placeholder='Search...' className='w-[80%] border outline-none rounded-md px-2 py-1'/>
                <button><IoIosSearch size={25}/></button>
            </form>

            {loading && [0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-5  p-3 rounded-md">
                    <div className="rounded-full bg-gray-300 w-[90px] h-[66px]"></div>
                    <div className="flex flex-col gap-3 w-full">
                        <div className="bg-gray-300 h-4 w-[200px] rounded-md"></div> 
                        <div className="bg-gray-300 h-3 w-[150px] rounded-md"></div>
                    </div>
                </div>
            ))}

            <div className='w-full h-full overflow-x-hidden overflow-scroll overflow-y-auto '>
            {!loading && (
                <div className='w-full'>
                    {conversations.map((conversation) => (
                        <Conversation key={conversation._id} conversation={conversation}/>
                    )) }
                </div>
            )}
            </div>
        </div>

        <div className='border-[1px]'></div>

        <div className='w-[70%] h-full'>
                {!selectedConversations.conversationId && (
                    <div className='flex h-full gap-2 flex-col justify-center items-center'>
                
                    <h5 className='text-[20px]'>Your messages</h5>
                    <p className='text-[13px] text-gray-500'>Send a message to start a chat</p>
            
                    </div>
                )}

                {selectedConversations.conversationId && <MessageContainer/> }
        </div>
    </div>
  )
}

export default ChatPage
