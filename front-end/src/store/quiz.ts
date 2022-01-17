/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalStorageKeys } from 'src/constants/localStoragekey';

const initialState = {
  // eslint-disable-next-line
  quiz: {} as any,
  manageQuizCurQuiz: {} as any,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    handleTakeQuiz: (state, action: PayloadAction<any>) => {
      state.quiz = action.payload;
      localStorage.setItem(LocalStorageKeys.CURRENT_QUIZ, JSON.stringify(action.payload));
    },
    handleEndQuiz: (state) => {
      state.quiz = initialState.quiz;
    },
    handleManageQuiz: (state, action: PayloadAction<any>) => {
      state.manageQuizCurQuiz = action.payload;
    },
    handleClearManageQuiz: (state) => {
      state.manageQuizCurQuiz = initialState.manageQuizCurQuiz;
    },
  },
  extraReducers: {},
});

export const { handleTakeQuiz, handleEndQuiz, handleManageQuiz, handleClearManageQuiz } = quizSlice.actions;

const { reducer: quizReducer } = quizSlice;

export default quizReducer;
