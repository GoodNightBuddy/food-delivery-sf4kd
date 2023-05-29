import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionType } from "./common";
import { API, getAPIEndpoint } from "../../enums/API";
import axios from "axios";

const initUser = createAsyncThunk(
  ActionType.INIT_USER,
  async () => {
    let userId = Number(localStorage.getItem('userId'));
    const checkResponse = await axios.get(getAPIEndpoint(API.users) + API.slash + userId);
    const checkedUserId = Number(checkResponse.data.userId);

    if (!userId || userId !== checkedUserId) {
      const response = await axios.post(getAPIEndpoint(API.users));
      userId = Number(response.data.userId);
      localStorage.setItem('userId', userId.toString())
    }

    return { userId }
  }
)

export { initUser }