import { configureStore } from '@reduxjs/toolkit';
import {authSlice} from './Slices/authSlice';
import { userSlice } from './Slices/userSlice';
import { postSlice } from './Slices/postSlices';
import { conversationsSlice } from './Slices/messageSlice';
import { selectedConversationsSlice } from './Slices/conversationSlice';

export const store = configureStore({
    reducer:{
        auth: authSlice.reducer,
        user: userSlice.reducer,
        post:postSlice.reducer,
        conversations:conversationsSlice.reducer,
        selectedConversations:selectedConversationsSlice.reducer,
    }
})