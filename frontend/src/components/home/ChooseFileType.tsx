import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { DATA_TYPES } from '../../helpers/enum/home'
import { useDispatch, useSelector } from 'react-redux'
import { changeDurationFilter, resetApiResultsAction } from '../../redux/states/apiRequest'
import { AppDispatch, RootState } from '../../redux/store'

export const ChooseFileType = () => {
    const dispatch: AppDispatch = useDispatch();
    const invalidPayload: boolean = useSelector((state: RootState) => state.apiRequest.invalidPayload);
    const show: boolean = useSelector((state: RootState) => state.home.startAnalysis);

    const handleDataTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const type: string = e.target.value;
        dispatch(changeDurationFilter(type));
        dispatch(resetApiResultsAction());
    }


    return (
        <FormControl sx={{ 
            opacity: show ? 1 : 0,
            visibility: show ? 'visible' : 'hidden',
            transition: 'opacity 2s, visibility 2s',
         }}>
            <FormLabel sx={{mt:3, mb: 3}} id="demo-radio-buttons-group-label">Choose data Type</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                onChange={handleDataTypeChange}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <FormControlLabel value={DATA_TYPES.IMAGE} control={<Radio />} label={DATA_TYPES.IMAGE} />
                <FormControlLabel value={DATA_TYPES.TEXT} control={<Radio />} label={DATA_TYPES.TEXT} />
                <FormControlLabel value={DATA_TYPES.TABULAR} control={<Radio />} label={DATA_TYPES.TABULAR} />
            </RadioGroup>

                {invalidPayload && <span style={{ color: 'red' }}>Invalid File Type</span>}
        </FormControl>
    )
}
