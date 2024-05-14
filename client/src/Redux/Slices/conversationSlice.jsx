import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversationId: '',
    userId: '',
    username: '',
    profilePic: ''
}

export const selectedConversationsSlice = createSlice({
    name:"selectedConversations",
    initialState:initialState,
    reducers:{
        setSelectedConversations: (state,action) => {
            const { conversationId, userId, username, profilePic } = action.payload;
            
            return {
                ...state,
                conversationId: conversationId,
                userId: userId,
                username: username,
                profilePic: profilePic
            };
        }
    }
})

export const {setSelectedConversations} = selectedConversationsSlice.actions;

export default selectedConversationsSlice.reducer;