import { createSlice, } from "@reduxjs/toolkit";

type User = {
    _id: string
    username: string
    fullName: string
    profileImage?: {
        url: string
    }
    following: string
    followers: string
    isVerified: boolean
    lastlogin: Date
}
export interface LoginResponse {
    statusCode: number
    success: boolean
    message: string
    data: {
        user: User
        accessToken: string
        refreshToken: string
    }
}

interface authState {
    status: 'loading' | 'unauthenticated' | 'authenticated'
    userData: LoginResponse | null
}

const initialState: authState = {
    status: 'loading',
    userData: null,
}





const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state) => {
            state.status = 'loading'
        },
        userinfo: (state, action) => {
            state.status = "authenticated";
            state.userData = action.payload

        },
        logout: (state) => {
            state.userData = null
            state.status = 'unauthenticated'

        },


    },




})
export const { logout, userinfo, setLoading } = authSlice.actions
export default authSlice.reducer