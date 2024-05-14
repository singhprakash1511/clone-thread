import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    conversations: [],
    loading: false,
    error: null,
  };

export const conversationsSlice = createSlice({
    name:"conversations",
    initialState,
    reducers:{
        setConversations(state,action){
            state.conversations=action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
          },
          setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
          },
      
    }
})

export const {setConversations,setLoading,setError} =  conversationsSlice.actions;

export default conversationsSlice.reducer;