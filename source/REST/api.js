import { MAIN_URL, TOKEN } from './config';

const StatusCode = {
    SUCCESS:     200,
    REDIRECTION: 300,
};

const headers = {
    Authorization:  TOKEN,
    'Content-Type': 'application/json',
};

const checkStatus = (response) => {
    if (
        response.status >= StatusCode.SUCCESS &&
        response.status < StatusCode.REDIRECTION
    ) {
        return response;
    }
    throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => response.json();

export const api = {
    getData: async () => {
        const response = await fetch(MAIN_URL, {
            method: 'GET',
            headers,
        });
        const responseStatus = await checkStatus(response);
        const responseData = await toJSON(responseStatus);

        return responseData.data;
    },
};
