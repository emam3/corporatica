import { Button, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ChooseFileType } from '../components/home/ChooseFileType';
import { UploadFile } from '../components/home/UploadFile';
import { buttonStyle } from '../helpers/common';
import { AnalysisResults } from '../Layouts/home/AnalysisResults';
import { changeStartAnalysis } from '../redux/states/home';
import { AppDispatch, RootState } from '../redux/store';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TextServicesChoice } from '../components/analysis/TextServicesChoice';
import { DATA_TYPES } from '../helpers/enum/home';


export const Home = (): JSX.Element => {

    const dispatch: AppDispatch = useDispatch();
    const isApiLoading: boolean = useSelector((state: RootState) => state.apiRequest.isApiLoading);
    const fileType: string = useSelector((state: RootState) => state.apiRequest.fileType);
    
    
    const handleStart = () => dispatch(changeStartAnalysis(true));
    
    return (
        <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'}>
            
            <Typography variant="h3" component="h2">
                Analyze whatever you want!
            </Typography>

            <Stack flexDirection={'row'} mt={2} gap={2} justifyContent={'center'}>
                <Button sx={buttonStyle} onClick={handleStart}>Start</Button>
                <Button sx={buttonStyle} disabled>Get my history</Button>
            </Stack>
            
            <ChooseFileType />

            <UploadFile />
            {fileType === DATA_TYPES.TEXT &&
            <TextServicesChoice />}
            {isApiLoading && <LoadingSpinner />}
            <AnalysisResults />


        </Stack>
    )
}
