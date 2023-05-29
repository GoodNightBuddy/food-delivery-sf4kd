import { createReducer, isAnyOf } from "@reduxjs/toolkit";
import { initUser } from "./actions";

type InitialState = {
  userId: null | number;
  loading: boolean
}

const initialState: InitialState = {
  userId: null,
  loading: false
}
const reducer = createReducer(initialState, (builder) => {
  builder
    .addMatcher(
      isAnyOf(
        initUser.pending,
      ),
      state => {
        state.loading = true
      }
    )

    .addMatcher(
      isAnyOf(
        initUser.fulfilled,
      ),
      (state, action) => {
        state.loading = false
        state.userId = action.payload.userId
      }
    )

    .addMatcher(
      isAnyOf(
        initUser.rejected
      ),
      (state, action) => {
        state.loading = false
        state.userId = null
        alert(action.error.message)
      }
    )
})

export { reducer };

