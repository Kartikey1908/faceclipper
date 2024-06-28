import axios from "axios";


export const axiosInstance = axios.create();

export const apiConnector = (method, url, bodyData, headers, params, imageFile) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
        imageFile : imageFile ? imageFile : null
    });
}