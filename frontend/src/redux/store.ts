//  redux
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import apiRequest from './states/apiRequest.ts';
import home from './states/home.ts';

const reducer = combineReducers({
  // here we will be adding reducers
  apiRequest,
  home
});


export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export type RootState = ReturnType<typeof reducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store