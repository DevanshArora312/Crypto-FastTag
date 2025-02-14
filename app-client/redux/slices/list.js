import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list : []
};

const slice = createSlice({
    name : "list",
    initialState,
    reducers : {
        setChatList : (state,action) => {
            state.list = action.payload;
        },
        addChat : (state,action) => {
            state.list.splice(0,0,action.payload)
        },
        updateLastMsg : (state,action) => {
            state.list.map((item,index)=>{
                if (item._id.toString() === action.payload.id.toString()){
                    if (action.payload.type === "image") item.lastMess = "Image";
                    else item.lastMess = action.payload.message;
                    item.read = action.payload.read;
                    item.messName = action.payload.messName;
                    item.sentOn = action.payload.sentOn
                }
            })
        },
        setUnread : (state,action) => {
            state.list.forEach((item)=>{
                if (item._id.toString() === action.payload.id.toString()){
                    item.unread = action.payload.value;
                }
            })
        }
    }
}) 

export const {setChatList,addChat,updateLastMsg,setUnread} = slice.actions;
export default slice.reducer;