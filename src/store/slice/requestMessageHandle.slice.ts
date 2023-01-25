import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {toast} from "react-toastify";

type messageStoreState = {
    message: string;
}


const slice = createSlice({
    name: "requestMessageHandle",
    initialState: {
        message: ""
    } as messageStoreState,
    reducers: {
        callErrorToast: (store, action: PayloadAction<string>) => {
            toast.error(action.payload);
        },
        callSuccessToast: (store, action: PayloadAction<string>) => {
            toast.success(action.payload);
        },
    },
})

export default slice.reducer;
export const {callErrorToast, callSuccessToast} = slice.actions
