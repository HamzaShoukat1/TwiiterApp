import { createSlice, } from "@reduxjs/toolkit";

type User = {
    _id: string
    username: string
    fullName: string
    profileImage?: {
        url: string
    }
    following:string
    followers:string
    isVerified:boolean
    lastlogin:Date
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
    status: 'unauthenticated' | 'pending' | 'succeeded'
    userData: LoginResponse | null
}


const initialState: authState = {
    status: 'unauthenticated',
    userData: null,
}



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setPending: (state) => {
            state.status = 'pending'
        },
        userinfo: (state, action) => {
            state.status = "succeeded";
            state.userData = action.payload

        },
        logout: (state) => {
            state.userData = null
            state.status = 'unauthenticated'

        },


    },




})
export const { logout, userinfo, setPending } = authSlice.actions
export default authSlice.reducer