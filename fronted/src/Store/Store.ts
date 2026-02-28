import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../Store/AuthSlice"
import { getData, saveData } from './localStorage';

const persistentState = getData()

export const Store = configureStore({
    reducer: {
        auth: authReducer
    },
    preloadedState: {
        auth: persistentState
    }

});
Store.subscribe(() => {
    saveData(Store.getState().auth)

})

export type RootState = ReturnType<typeof Store.getState>

export type AppDispatch = typeof Store.dispatch