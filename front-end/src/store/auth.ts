/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'src/services/axios';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from 'src/firebase/firebase';
import { NOTIFICATION_TYPE, openCustomNotificationWithIcon } from 'src/components/notification';
import { clearQuizLocalStorage } from 'src/constants/localStoragekey';

export const login: any = async (body: { email: string; password: string }) => {
  try {
    await signInWithEmailAndPassword(auth, body.email, body.password);
    openCustomNotificationWithIcon(NOTIFICATION_TYPE.SUCCESS, 'Loged in successfully', '');
    return true;
  } catch (error: any) {
    openCustomNotificationWithIcon(NOTIFICATION_TYPE.ERROR, 'Loged in failed', `${new Error(error).message}`);
    return false;
  }
};

export const signup = createAsyncThunk('signup', async (body: any, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/admin/login', body);

    return res;
  } catch (err: any) {
    return rejectWithValue(err.response.data);
  }
});

const initialState = {
  user: {} as any,
  error: '',
  loading: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    handleLogin: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    updateUserInfo: (state, action: PayloadAction<any>) => {
      state.user = { ...state.user, ...action.payload };
    },
    handleLogout: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      clearQuizLocalStorage();
    },
  },
  extraReducers: {},
});

export const { handleLogin, updateUserInfo, handleLogout } = accountSlice.actions;

const { reducer: accountReducer } = accountSlice;

export default accountReducer;
