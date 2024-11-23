// src/common/test/axios.mock.js
import { jest } from '@jest/globals';

const mockAxiosInstance = {
    defaults: {
        headers: {},
    },
    interceptors: {
        response: {
            use: jest.fn(),
        },
    },
    get: jest.fn(),
    post: jest.fn(),
    // Add any other methods you use from Axios instance
};

export const axiosMock = {
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn(),
    post: jest.fn()
    // Add any other methods or properties you use from Axios
};