import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts : [ ],
}

export const postSlice = createSlice({
    name:"post",
    initialState:initialState,
    reducers: {
        setPost(state, value) {
            state.posts = value.payload;
        }
    }
})

export const {setPost} = postSlice.actions;
export default postSlice.reducer;