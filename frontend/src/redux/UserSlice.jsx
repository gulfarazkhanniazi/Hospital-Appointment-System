import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { id, name, email, token }
};

const userSlice = createSlice({
  name: "dasuser",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // payload = {id, name, email, token}
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
