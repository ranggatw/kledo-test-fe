import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    hp: '',
    email: '',
    profileImage: ''
}
const counterSlice = createSlice({
  name: 'counter',
  initialState: {...initialState},
  reducers: {
    reset: () => initialState,
    setUser: (state, action) => {
        state.username = action.payload.name
        state.hp = action.payload.hp
        state.email = action.payload.email
        state.profileImage = action.payload.profileImage
    }
  },
});

export const { reset, setUser } = counterSlice.actions;
export default counterSlice.reducer;