import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  user:null,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

 export const userSlice = createSlice({
    name:'user',
    initialState:initialState,
    reducers:{
        setUser(state, action) {
            state.setUser = action.payload;
          },
          setToken(state,action){
            state.token = action.payload
          }
    }
  })

  export const { setUser,setToken} = userSlice.actions;

export default userSlice.reducer;