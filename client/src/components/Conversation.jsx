import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { setSelectedConversations } from '../Redux/Slices/conversationSlice';

const Conversation = ({conversation, isOnline}) => {
  
  const {token} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const currUser = token.user;
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  return (
    <div className='w-full'>
      <div className='cursor-pointer flex gap-3 items-center hover:bg-gray-100 rounded-md py-2 px-2' onClick={() => dispatch(setSelectedConversations({
      mock:conversation.mock,
      conversationId: conversation._id,
      userId: user._id,
      username: user.username,
      profilePic: user.profilePic,
    }))}>
      <div>
        <img src={user?.profilePic} alt="userPic" className='w-[60px] h-[60px] rounded-full'/>
        {isOnline ? (
          <div className='relative'>
            <div className='w-[15px] h-[15px] rounded-full z-[100] bg-green-500 absolute right-0 bottom-2'></div>
          </div>
        ) : ""}
      </div>

      <div className='flex flex-col gap-[2px]'>
        <h5 >{user?.username}</h5>
        <p className='text-[14px] text-gray-400'>
          {currUser?._id === lastMessage.sender  ?  "You: " : ""}
          {lastMessage.text.length > 20 ? lastMessage.text.substring(0,20) + "..." : lastMessage.text}
          </p>
      </div>
    </div>
    </div>
  )
}

export default Conversation
