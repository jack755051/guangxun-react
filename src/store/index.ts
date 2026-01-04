import { configureStore } from "@reduxjs/toolkit";
import footerReducer from "./footer/footerSlice";
import headerReducer from "./header/headerSlice";

export const store = configureStore({
  reducer: {
    footer: footerReducer,
    header: headerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
