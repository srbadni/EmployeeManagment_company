import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type AuthStoreState = {
    sidebarShow: boolean,
    unfoldable: boolean
}


const slice = createSlice({
    name: "auth",
    initialState: {
        sidebarShow: true,
        unfoldable: false
    } as AuthStoreState,
    reducers: {
        toggleSidebar: (store, action: PayloadAction) => {
            store.sidebarShow = !store.sidebarShow
        },
        toggleUnfoldable: (store, action: PayloadAction) => {
            store.unfoldable = !store.unfoldable
        },
    },
})

export default slice.reducer;
export const {toggleSidebar, toggleUnfoldable} = slice.actions
