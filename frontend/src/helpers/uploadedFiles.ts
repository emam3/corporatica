import { DATA_TYPES } from "./enum/home";

export const ALLOWED_IMAGES = ["image/png", "image/jpg", "image/jpeg"];

export const ALLOWED_FILES = ["text/plain"];

export const ALLOWED_TABLES = ["text/csv"];

export const checkValidFile = (fileType: string, chosenType: string): boolean => {
    if(chosenType === DATA_TYPES.IMAGE) {
        return ALLOWED_IMAGES.includes(fileType);
    } else if(chosenType === DATA_TYPES.TEXT) {
        return ALLOWED_FILES.includes(fileType);
    } else if(chosenType === DATA_TYPES.TABULAR) {
        return ALLOWED_TABLES.includes(fileType);
    }
    return false;
}