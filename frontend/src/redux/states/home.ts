import { createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";

// Slice
const slice = createSlice({
  name: "home",
  initialState: {
    startAnalysis: false as boolean,
    apiResponseExists: false as boolean,
  },
  reducers: {
    setStartAnalysis: (state, action) => {
      state.startAnalysis = action.payload;
    },
    setApiResponseExists: (state, action) => {
      state.apiResponseExists = action.payload;
    },
  },
});

export default slice.reducer;

const { setStartAnalysis, setApiResponseExists } = slice.actions;

export const changeStartAnalysis =
  (start: boolean) =>
  (dispatch: Dispatch): void => {
    dispatch(setStartAnalysis(start));
  };

export const changeApiResponseExists =
  (exists: boolean) =>
  (dispatch: Dispatch): void => {
    dispatch(setApiResponseExists(exists));
  };
