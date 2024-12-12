import React from 'react';
import { Stack, Typography } from '@mui/material';
import PuffLoader from "react-spinners/PuffLoader";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export const LoadingSpinner = (): JSX.Element => {

    const isApiLoading: boolean = useSelector((state: RootState) => state.apiRequest.isApiLoading);

    return (
        <Stack alignItems='center'
            justifyContent='center'
            height={'100%'}
            width={'100%'}
            sx={{
                opacity: isApiLoading ? 1 : 0,
                mt: 5,
                visibility: isApiLoading ? 'visible' : 'hidden',
                transition: 'opacity 2s, visibility 2s',
            }}>
            <Typography variant='h3'>Loading...</Typography>
            <PuffLoader color={'#2563EB'} size={100} />
        </Stack>
    );
}
