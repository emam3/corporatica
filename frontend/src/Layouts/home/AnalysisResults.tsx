import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ImageAnalysisResult } from '../../components/results/ImageAnalysisResult';
import { TextAnalysisResult } from '../../components/results/TextAnalysisResult';
import { TabularMeanChart } from '../../components/analysis/TabularMeanChart';
import { TabularBoxPlot } from '../../components/analysis/TabularBoxPlot';
import { Stack } from '@mui/material';
import { DATA_TYPES } from '../../helpers/enum/home';


export const AnalysisResults: React.FC = (): JSX.Element => {
    const fileType: string = useSelector((state: RootState) => state.apiRequest.fileType);
    const show: boolean = useSelector((state: RootState) => state.home.apiResponseExists);

    return (
        <Stack sx={{
            opacity: show ? 1 : 0,
            mt: 5,
            visibility: show ? 'visible' : 'hidden',
            transition: 'opacity 2s, visibility 2s',
            width: '100%',
        }}>

            {fileType === DATA_TYPES.IMAGE && <ImageAnalysisResult />}
            {fileType === DATA_TYPES.TEXT && <TextAnalysisResult />}
            {fileType === DATA_TYPES.TABULAR && <TabularMeanChart />}
            {fileType === DATA_TYPES.TABULAR && <TabularBoxPlot />}
        </Stack>
    )
}
