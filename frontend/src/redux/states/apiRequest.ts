import { createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { tabularAnalysisResult } from "../../helpers/types/api";


// Slice
const slice = createSlice({
  name: "apiRequest",
  initialState: {
    fileType: "" as string,
    imageAnalysisResult: {
      histogramData: {
        blue: [],
        green: [],
        red: [],
      },
      img1: "" as string,
      img2: "" as string,
    },
    textAnalysisResult: {
      classification: "" as string,
      summary: "" as string,
      T_SNE_IMG: "" as string,
      keywords: [] as string[],
    },
    tabularAnalysisResult: {} as tabularAnalysisResult,
    isApiLoading: false as boolean,
    isApiError: false as boolean,
    invalidPayload: false as boolean,
    requiredTextServices: [] as string[],
  },
  reducers: {
    setFileType: (state, action) => {
      state.fileType = action.payload;
    },
    setImageAnalysisResults: (state, action) => {
      state.imageAnalysisResult = action.payload;
    },
    setTextAnalysisResults: (state, action) => {
      state.textAnalysisResult = action.payload;
    },
    setTabularAnalysisResults: (state, action) => {
      state.tabularAnalysisResult = action.payload;
    },
    setIsApiLoading: (state, action) => {
      state.isApiLoading = action.payload;
    },
    setIsApiError: (state, action) => {
      state.isApiError = action.payload;
    },
    setInvalidPayload: (state, action) => {
      state.invalidPayload = action.payload;
    },
    setRequiredTextServices: (state, action) => {
      state.requiredTextServices = action.payload;
    },
    resetApiResults: (state) => {
      state.imageAnalysisResult = {
        histogramData: {
          blue: [],
          green: [],
          red: [],
        },
        img1: "",
        img2: "",
      };
      state.textAnalysisResult = {
        classification: "",
        summary: "",
        T_SNE_IMG: "",
      };
      state.tabularAnalysisResult = {};
      state.isApiLoading = false;
      state.isApiError = false;
      state.invalidPayload = false;
      state.requiredTextServices = [];
    },
  },
});

export default slice.reducer;

const {
  setFileType,
  setImageAnalysisResults,
  setTextAnalysisResults,
  setTabularAnalysisResults,
  setIsApiLoading,
  setIsApiError,
  setInvalidPayload,
  setRequiredTextServices,
  resetApiResults,
} = slice.actions;

export const changeDurationFilter =
  (type: string) =>
  (dispatch: Dispatch): void => {
    dispatch(setFileType(type));
  };

export const changeImageAnalysisResults =
  (data: unknown) =>
  (dispatch: Dispatch): void => {
    dispatch(setImageAnalysisResults(data));
  };

export const changeTextAnalysisResults =
  (data: unknown) =>
  (dispatch: Dispatch): void => {
    dispatch(setTextAnalysisResults(data));
  };

export const changeTabularAnalysisResults =
  (data: unknown) =>
  (dispatch: Dispatch): void => {
    dispatch(setTabularAnalysisResults(data));
  };

export const changeIsApiLoading =
  (data: unknown) =>
  (dispatch: Dispatch): void => {
    dispatch(setIsApiLoading(data));
  };

export const changeIsApiError =
  (data: boolean) =>
  (dispatch: Dispatch): void => {
    dispatch(setIsApiError(data));
  };

export const changeIsInvalidPayload =
  (data: boolean) =>
  (dispatch: Dispatch): void => {
    dispatch(setInvalidPayload(data));
  };

export const changeRequiredTextServices =
  (data: string[]) =>
  (dispatch: Dispatch): void => {
    dispatch(setRequiredTextServices(data));
  };

export const resetApiResultsAction =
  () =>
  (dispatch: Dispatch): void => {
    dispatch(resetApiResults());
  };
