import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionType } from "./common";
import axios from "axios";
import { getAPIEndpoint, API } from "../../enums/API";
import { IShop } from "../types/types";

interface IShopResponse {
  currentShopId: number | null;
}

interface IShopsRespone {
  shops: IShop[]
}

const setCurrentShop = createAsyncThunk<IShopResponse, number | null>(
  ActionType.SET_CURRENT_SHOP,
  async (currentShopId) => {
    if (currentShopId || currentShopId === null) {
      return { currentShopId };
    } else {
      throw new Error("Invalid shopId"); // Throw an error if shopId is falsy
    }
  },
);

const initCurrentShop = createAsyncThunk<IShopResponse, number>(
  ActionType.INIT_CURRENT_SHOP,
  async (userId) => {
    const response = await axios.get(getAPIEndpoint(API.cart) + API.slash + userId);

    if (response.data?.cart?.length) {
      return { currentShopId: response.data.cart[0].shop_id }
    } else {
      return { currentShopId: null }
    }
  }
);

const setShops = createAsyncThunk<IShopsRespone, void>(
  ActionType.SET_SHOPS,
  async () => {
    const response = await axios.get(getAPIEndpoint(API.shops));
    return { shops: response.data }
  },
);

export { setCurrentShop, initCurrentShop, setShops };
