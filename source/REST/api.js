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

    createTask: async (message) => {
        const response = await fetch(MAIN_URL, {
            method: 'POST',
            headers,
            body:   JSON.stringify({ message }),
        });
        const responseStatus = await checkStatus(response);
        const responseData = await toJSON(responseStatus);

        const { data: task } = await responseData;

        return task;
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
        const {
            data: [updatedTask],
        } = await responseData;

        return updatedTask;
    },
    completeAllTasks: async (tasks) => {
        const promises = [];

        for (const task of tasks) {
            promises.push(
                fetch(MAIN_URL, {
                    method: 'PUT',
                    headers,
                    body:   JSON.stringify([{ ...task, completed: true }]),
                })
            );
        }

        const responses = await Promise.all(promises);

        responses.every((result) => checkStatus(result));
    },
};
