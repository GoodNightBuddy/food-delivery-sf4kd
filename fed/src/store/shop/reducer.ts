import { createReducer, isAnyOf } from "@reduxjs/toolkit";
import { initCurrentShop, setCurrentShop, setShops } from "./actions";
import { IShop } from "../types/types";

type InitialState = {
  currentShopId: null | number;
  loading: boolean;
  shops: IShop[];
}

const initialState: InitialState = {
  currentShopId: null,
  loading: false,
  shops: []
}
const reducer = createReducer(initialState, (builder) => {
  builder
    .addMatcher(
      isAnyOf(
        setCurrentShop.pending,
        initCurrentShop.pending,
        setShops.pending,
      ),
      state => {
        state.loading = true
      }
    )

    .addMatcher(
      isAnyOf(
        setCurrentShop.fulfilled,
        initCurrentShop.fulfilled
      ),
      (state, action) => {
        state.loading = false
        state.currentShopId = action.payload.currentShopId
      }
    )

    .addMatcher(
      isAnyOf(
        setShops.fulfilled,
      ),
      (state, action) => {
        state.loading = false
        state.shops = action.payload.shops
      }
    )

    .addMatcher(
      isAnyOf(
        setCurrentShop.rejected,
        initCurrentShop.rejected
      ),
      (state, action) => {
        state.loading = false
        state.currentShopId = null
        alert(action.error.message)
      }
    )
})

export { reducer };

