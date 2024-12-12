import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { AxiosResponse } from "axios";
import { DATA_TYPES } from "../enum/home";
import { changeImageAnalysisResults, changeTextAnalysisResults, changeTabularAnalysisResults, changeIsApiLoading } from "../../redux/states/apiRequest";
import { environment } from "../environment";
import { changeApiResponseExists } from "../../redux/states/home";


export const useAnalysisResponseHandler = () => {
  const dispatch: AppDispatch = useDispatch();
  const fileType: string = useSelector(
    (state: RootState) => state.apiRequest.fileType
  );

  return (res: AxiosResponse) => {
    dispatch(changeApiResponseExists(true))
    if (fileType === DATA_TYPES.IMAGE) {
      const imgUrl1: string = `${environment.REACT_APP_IMAGES_URL}/${res?.data?.image_id}_1.png`;
      const imgUrl2: string = `${environment.REACT_APP_IMAGES_URL}/${res?.data?.image_id}_2.png`;
      const data = {
        histogramData: {
          blue: res?.data?.histogram?.blue,
          green: res?.data?.histogram?.green,
          red: res?.data?.histogram?.red,
        },
        img1: imgUrl1,
        img2: imgUrl2,
      };
      dispatch(changeImageAnalysisResults(data));
    } else if (fileType === DATA_TYPES.TEXT) {
      const summary = res?.data?.analysis_result?.summary;
      const keywords = res?.data?.analysis_result?.keywords;
      const classification =
        res?.data?.analysis_result?.sentiment?.classification;

      const T_SNE_IMG: string = `${environment.REACT_APP_IMAGES_URL}/${res?.data?.dataset_id}.png`;
      const data = {
        summary,
        classification,
        T_SNE_IMG,
        keywords
      };
      dispatch(changeTextAnalysisResults(data));
    } else if (fileType === DATA_TYPES.TABULAR) {
      dispatch(changeTabularAnalysisResults(res?.data?.analysis?.details));
    }
    
    dispatch(changeIsApiLoading(false));
  };
};

export function convertSearchParamsToString(searchParams: object) {
  let newSearchParamsString = "";

  const newParametersEntries = Object.entries(searchParams).filter(
    ([key, value]) => key && value
  );

  if (newParametersEntries.length) {
    newSearchParamsString =
      "?" +
      newParametersEntries
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join("&");
  }

  return newSearchParamsString;
}