const process = import.meta.env;

export const environment = {
    REACT_APP_API_URL: process.REACT_APP_API_URL || "http://localhost:8080/api",
    REACT_APP_IMAGES_URL: process.REACT_APP_IMAGES_URL ||"http://localhost:8080/image",
};