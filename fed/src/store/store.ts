import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./rootReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
  }
})

export { store };