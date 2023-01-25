import {configureStore} from "@reduxjs/toolkit";
import authReducer from './slice/auth.slice'
import layoutReducer from './slice/layout.slice'
import messageReducer from './slice/requestMessageHandle.slice'

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const store = configureStore({
    reducer: {
        auth: authReducer,
        layout: layoutReducer,
        requestMessageHandle: messageReducer
    }
})

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
// Inferred type: {posts: PostsState, comments: CommentsState, employees: UsersState}
