import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
