import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversationId: '',
    userId: '',
    username: '',
    profilePic: '',
    mock:false
}

export const selectedConversationsSlice = createSlice({
    name:"selectedConversations",
    initialState:initialState,
    reducers:{
        setSelectedConversations: (state, action) => {
            const { mock, conversationId, userId, username, profilePic } = action.payload;
            state.mock = mock; // Update mock property
            state.conversationId = conversationId;
            state.userId = userId;
            state.username = username;
            state.profilePic = profilePic;
        }
    }
})

export const {setSelectedConversations} = selectedConversationsSlice.actions;

export default selectedConversationsSlice.reducer;