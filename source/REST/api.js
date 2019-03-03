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
    fetchTasks: async () => {
        const response = await fetch(MAIN_URL, {
            method: 'GET',
            headers,
        });
        const responseStatus = await checkStatus(response);
        const responseData = await toJSON(responseStatus);

        const { data: tasks } = await responseData;

        return tasks;
    },

    createTask: async (task) => {
        const response = await fetch(MAIN_URL, {
            method: 'POST',
            headers,
            body:   JSON.stringify(task),
        });
        const responseStatus = await checkStatus(response);
        const responseData = await toJSON(responseStatus);

        const { data } = await responseData;

        return data;
    },

    removeTask: async (id) => {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method: 'DELETE',
            headers,
        });

        await checkStatus(response);
    },

    updateTask: async (task) => {
        const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers,
            body:   JSON.stringify([task]),
        });

        const responseStatus = await checkStatus(response);
        const responseData = await toJSON(responseStatus);
        const { data } = await responseData;

        return data;
    },

    completeAllTasks: async (tasks) => {
        const response = tasks.map((task) => {
            return fetch(MAIN_URL, {
                method: 'PUT',
                headers,
                body:   JSON.stringify([task]),
            });
        });

        await Promise.all(response)
            .then((resolve) => resolve.forEach((result) => checkStatus(result)))
            .catch((error) => `${error.message}`);
    },
};
