import { configureStore } from '@reduxjs/toolkit';
import {authSlice} from './Slices/authSlice';
import { userSlice } from './Slices/userSlice';
import { postSlice } from './Slices/postSlices';

export const store = configureStore({
    reducer:{
        auth: authSlice.reducer,
        user: userSlice.reducer,
        post:postSlice.reducer,
    }
})