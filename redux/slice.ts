import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: {
    id: number | null;
    name: string | null;
    email: string | null;
  };
  token: string | null;
}

const initialState: UserState = {
  user: {
    id: null,
    name: null,
    email: null,
  },
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: UserState['user']; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearUser(state) {
      state.user = initialState.user;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
