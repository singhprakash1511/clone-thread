import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  user:null,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

 export const userSlice = createSlice({
    name:'user',
    initialState:initialState,
    reducers:{
        setUser(state, value) {
            state.setUser = value.payload;
          },
          setToken(state,value){
            state.token = value.payload
          }
    }
  })

  export const { setUser,setToken} = userSlice.actions;

export default userSlice.reducer;