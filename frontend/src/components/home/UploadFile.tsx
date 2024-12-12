import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { analysisApi, endPoints } from '../../helpers/api'
import { AppDispatch, RootState } from '../../redux/store'
import { useAnalysisResponseHandler } from '../../helpers/functions/api'
import { checkValidFile } from '../../helpers/uploadedFiles'
import { changeIsApiLoading, changeIsInvalidPayload } from '../../redux/states/apiRequest'
import { Button, Stack } from '@mui/material'
import { buttonStyle } from '../../helpers/common'

export const UploadFile = () => {
    const analysisResponseHandler = useAnalysisResponseHandler();
    const dispatch: AppDispatch = useDispatch();
    const fileRef = React.useRef<HTMLInputElement>(null);

    const [disabled, setDisabled] = React.useState(true);
    const fileType: string = useSelector((state: RootState) => state.apiRequest.fileType)
    const textServices: string[] = useSelector((state: RootState) => state.apiRequest.requiredTextServices)
    const handleUpload = () => {

        const file: File | undefined = fileRef.current?.files?.[0]
        if (!file) return;
        const url: string = `${endPoints[fileType]}`;
        const formData = new FormData();
        formData.append("file", file);
        if (textServices.length > 0) formData.append("services", String(textServices));
        dispatch(changeIsApiLoading(true));
        analysisApi.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(analysisResponseHandler)
            .catch((err) => {
                console.error(err);
                dispatch(changeIsApiLoading(false));
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];
        if (!file) {
            dispatch(changeIsInvalidPayload(true));
            setDisabled(true);
            return;
        }

        const isValidFile: boolean = checkValidFile(file?.type, fileType);
        if (!isValidFile) {
            dispatch(changeIsInvalidPayload(true));
            setDisabled(true);
            return;
        } else {
            dispatch(changeIsInvalidPayload(false));
            setDisabled(false);
        }
    }

    return (
        fileType &&
        <>
            <Stack width={'100%'} flexDirection={'row'} gap={2} alignItems={'center'} justifyContent={'center'}>
                <Button sx={buttonStyle}>
                    <label htmlFor="files" className="btn">Browse Files</label>
                </Button>
                <input onChange={handleChange} id="files" ref={fileRef} style={{ display: 'none' }} type="file" />

                <Button sx={buttonStyle}
                    disabled={disabled}
                    onClick={handleUpload}>
                    Upload
                </Button>
            </Stack>
        </>
    )
}
