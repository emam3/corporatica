import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React from 'react';
import { TEXT_SERVICES } from '../../helpers/enum/home';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { changeRequiredTextServices } from '../../redux/states/apiRequest';

export const TextServicesChoice = () => {
    const dispatch: AppDispatch = useDispatch();
    const selectedServices: string[] = useSelector((state: RootState) => state.apiRequest.requiredTextServices);

    const handleChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        const checkedValue: string = (e.target as HTMLDivElement).value;
        if(!checkedValue) return;
        const servicesHolder: string[] = [...selectedServices];
        if (servicesHolder.includes(checkedValue)) {
            const index: number = servicesHolder.indexOf(checkedValue);
            servicesHolder.splice(index, 1);
        } else servicesHolder.push(checkedValue);        
        dispatch(changeRequiredTextServices(servicesHolder));        
    };

    return (
        <FormGroup onClick={handleChange}>
            <FormControlLabel control={<Checkbox />} value={TEXT_SERVICES.CLASSIFICATION} label={TEXT_SERVICES.CLASSIFICATION} />
            <FormControlLabel control={<Checkbox />} value={TEXT_SERVICES.SUMMARIZATION} label={TEXT_SERVICES.SUMMARIZATION} />
            <FormControlLabel control={<Checkbox />} value={TEXT_SERVICES.T_SNE} label={TEXT_SERVICES.T_SNE} />
            <FormControlLabel control={<Checkbox />} value={TEXT_SERVICES.KEYWORD_EXTRACTOR} label={TEXT_SERVICES.KEYWORD_EXTRACTOR} />
        </FormGroup>
    )
}
