import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TUser } from "../types/globals";
import type { RootState } from './store'

const initialState: TUser = {
    uid: "",
    displayName: null,
    email: null,
    photoURL: undefined,
    emailVerified: false,
    isAnonymous: false,
    metadata: {
        creationTime: "",
        lastSignInTime: "",
    },
    phoneNumber: null,
    providerId: "",
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<TUser>) => {
            return action.payload;
        },
        logout: (state) => {
            return initialState;
        },
    },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
