import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const login = createAsyncThunk('auth/login', async ({username,password}) => {
    const response = await axios.post("http://localhost:5000/v1/api/login",{username,password});
    return response.data;
})

export const refreshToken = createAsyncThunk('auth/refreshToken', async ({token}, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:5000/v1/api/token", {token});
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

const authSlice = createSlice({
    name : 'auth',
    initialState : {
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
    },
    reducers : {
          setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            localStorage.setItem('accessToken', action.payload);
          },
          setRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
            localStorage.setItem('refreshToken', action.payload);
          },
          clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
    },
    extraReducers : builder => {
        builder.addCase(login.fulfilled, (state, action ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        });
        builder.addCase(refreshToken.fulfilled, (state,action) => {
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('accessToken', action.payload.accessToken);
        })
    }
})

export const {setAccessToken, setRefreshToken,clearTokens} = authSlice.actions;
export default authSlice.reducer;