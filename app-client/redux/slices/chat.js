import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chat : null
}

const slice = createSlice({
    name : "chat",
    initialState,
    reducers : {
        loadChat : (state,action) => {
            state.chat = action.payload
        },
        pushChat : (state,action) => {
            state.chat.messages.splice(0,0,action.payload)
        }
        
    }
}) 

export const {loadChat,pushChat} = slice.actions;
export default slice.reducer;