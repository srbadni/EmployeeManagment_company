import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ICompany} from "../../Models/AuthModels/Companies";

type AuthStoreState = {
    token: string | undefined,
    name: string | undefined,
    companyId: ICompany["id"] | undefined,
    permissions: string[]
}


const slice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token"),
        name: localStorage.getItem("name"),
        companyId: "",
        permissions: []
    } as AuthStoreState,
    reducers: {
        //todo separate login and companyLogin
        login: (store, action: PayloadAction<string>) => {
            store.token = action.payload
            // todo implement storage service
            localStorage.setItem("token", action.payload)
        },
        logout: (store, action: PayloadAction) => {
            store.token = undefined;
            localStorage.removeItem("token")
        },
        setPermissions: (store, action: PayloadAction<string[]>) => {
            store.permissions = action.payload;
        },
        setCompanyId: (store, action: PayloadAction<ICompany["id"]>) => {
            store.companyId = action.payload;
        }
    },
})

export default slice.reducer;
export const {logout, login, setPermissions, setCompanyId} = slice.actions
