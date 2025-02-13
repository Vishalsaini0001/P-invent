import { createSlice } from "@reduxjs/toolkit";

const name = JSON.parse(localStorage.getItem("name"));
const initialState = {
  isLoggedIn: false,
  name: name ? name : "",
  user: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
  },
  userId: "",
};

const authSlice = createSlice({
  name: "auth ",
  initialState,
  reducers: {
    SET_LOGIN(state, action){
      state.isLoggedIn = action.payload
    },
    SET_NAME(state, action){
      localStorage.setItem("name", JSON.stringify(action.payload))
      state.name = action.payload
      state.email = action.email
      state.phone = action.phone
      state.bio = action.bio
      state.photo = action.photo
    },
  },
})

export const {} = authSlice.actions;

export default authSlice.reducer;
