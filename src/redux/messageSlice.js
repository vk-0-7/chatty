import { createSlice } from '@reduxjs/toolkit'

const initialState = [];

 const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
     addmesssage:(state,action)=>{
      console.log(action.payload)
        return state=action.payload;
     }
  },
})

// Action creators are generated for each case reducer function
export const {addmesssage } = messageSlice.actions

export const messageReducer=  messageSlice.reducer