import { createSlice, } from "@reduxjs/toolkit";




const initialState = {
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
        login: (state, action) => {
            state.status = "succeeded",
                state.userData = action.payload

        },
        logout: (state) => {
            state.userData = null
            state.status = 'unauthenticated'

        },

        
    },
    
    
    

})
export const { logout } = authSlice.actions
export default authSlice.reducer