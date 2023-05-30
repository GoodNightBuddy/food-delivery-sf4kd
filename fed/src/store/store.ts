import { configureStore } from "@reduxjs/toolkit";
import { authReducer, shopReducer } from "./rootReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer
  }
})

export { store };