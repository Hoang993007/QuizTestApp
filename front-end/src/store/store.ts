import { configureStore } from '@reduxjs/toolkit';
import accountReducer from 'src/store/auth';
import quizReducer from './quiz';

const store = configureStore({
  reducer: {
    account: accountReducer,
    quiz: quizReducer,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
//Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;
