import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionType } from "./common";
import axios from "axios";
import { getAPIEndpoint, API } from "../../enums/API";

interface ShopResponse {
  shopId: number | null;
}

const setShop = createAsyncThunk<ShopResponse, number | null>(
  ActionType.SET_SHOP,
  async (shopId) => {
    if (shopId || shopId === null) {
      return { shopId };
    } else {
      throw new Error("Invalid shopId"); // Throw an error if shopId is falsy
    }
  },
);

const initShop = createAsyncThunk<ShopResponse, number>(
  ActionType.INIT_SHOP,
  async (userId) => {
    const response = await axios.get(getAPIEndpoint(API.cart) + API.slash + userId);

    if (response.data?.cart?.length) {
      return { shopId: response.data.cart[0].shop_id }
    } else {
      return { shopId: null }
    }
  }
);


export { setShop, initShop };
