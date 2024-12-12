import React from 'react'
import Histogram from '../analysis/Histogram'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Stack } from '@mui/material';

export const ImageAnalysisResult = () => {

    const imgSrc1 = useSelector((state: RootState) => state.apiRequest.imageAnalysisResult.img1);
    const imgSrc2 = useSelector((state: RootState) => state.apiRequest.imageAnalysisResult.img2);
    const show: boolean = useSelector((state: RootState) => state.home.apiResponseExists);
    return (
        <Stack sx={{
            opacity: show ? 1 : 0,
            visibility: show ? 'visible' : 'hidden',
            transition: 'opacity 2s, visibility 2s',
        }} gap={2} alignItems={'center'} justifyContent={'center'}>
            <Histogram />
            <Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'center'}>
                {imgSrc1 && <img src={imgSrc1} style={{ maxWidth: '50%' }} alt="Image Analysis Result" />}
                {imgSrc2 && <img src={imgSrc2} style={{ maxWidth: '50%' }} alt="Image Analysis Result" />}
            </Stack>
        </Stack>
    )
}
