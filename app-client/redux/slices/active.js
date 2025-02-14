import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    active : null
}

const slice = createSlice({
    name : "active",
    initialState,
    reducers : {
        setActive : (state,action) => {
            state.active = action.payload
        },
        
        
    }
}) 

export const {setActive} = slice.actions;
export default slice.reducer;