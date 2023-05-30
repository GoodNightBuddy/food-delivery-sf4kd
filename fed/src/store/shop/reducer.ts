import { createReducer, isAnyOf } from "@reduxjs/toolkit";
import { initShop, setShop } from "./actions";

type InitialState = {
  shopId: null | number;
  loading: boolean
}

const initialState: InitialState = {
  shopId: null,
  loading: false
}
const reducer = createReducer(initialState, (builder) => {
  builder
    .addMatcher(
      isAnyOf(
        setShop.pending,
        initShop.pending,
      ),
      state => {
        state.loading = true
      }
    )

    .addMatcher(
      isAnyOf(
        setShop.fulfilled,
        initShop.fulfilled
      ),
      (state, action) => {
        state.loading = false
        state.shopId = action.payload.shopId
      }
    )

    .addMatcher(
      isAnyOf(
        setShop.rejected,
        initShop.rejected
      ),
      (state, action) => {
        state.loading = false
        state.shopId = null
        alert(action.error.message)
      }
    )
})

export { reducer };

