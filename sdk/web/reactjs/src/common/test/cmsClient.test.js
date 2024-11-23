import CmsClient from '../cms-sdk/cmsClient'; // Adjust the path as per your file structure
import axios from 'axios';
import { jest } from '@jest/globals';

describe('CmsClient', () => {
    let cmsClientInstance;

    beforeAll(() => {
        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
        };
        cmsClientInstance = new CmsClient();
        cmsClientInstance.initialize();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset all mock functions after each test
    });

    it('should authenticate successfully and return token', async () => {
        const mockResponse = {
            data: {
                status: 'success',
                data: {
                    status: true,
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiODFlNGIyNjU0YTQxNTU0NDI1ZjBlMGVhZDgxNWUzZWEyZGU1M2Y2ZWYzODI2NDI3YmIxZmE1NWFhYWZjNTY3MzQ2ZDg2MzMzYzI2MzAyZGNmMGE1ZjdlZWI2NWNlODA3M2NkZDhhZjg1ZjYzOWZjYzZhMzQwNjM1NTc4OGZmMzljNzMyNTBjNTk0YTI5MzMwN2NkMzYwZDM3YzYwMjBkZDFiMzgzMTFkNGE1YmFhNjY2M2E0NjA1MmRhOTZlZDQ0MjcyNDljMWUxM2UwMDY2NmQyMDkzZjQyYjZhNDdiMDNmZjNiOTI1OTE0M2UzODdlMDU1OTRkYTdjZjFkMzVlNGRkOTc1ODg2ZjhmYzNkNWZkMjczY2IzNjI3ZmU1OGQyMzIyYjBmYjQxNDM4NzU4N2I5ZGQ5MDJjYmU0NTNlZWRjYjBkMzRkYzgwMGM4MzNmZGQ1Y2Y3MzVmZGU1ZDk1YjY5NzU3NWJmYmZkZTI5MDMwN2ZmNTZmMmE2NjYyMzAwODA1ODVlODI0ZDkzYzY1NDJkY2RiY2U5ZGFjYWQzZThmZGYwYmMzZmMzMDFjMWYyNGY0OGQwMTYwZDhkOWY4Y2IwYjQ2YzE3NzYxNTllZWM3ZGFmMjRiYWFjZmFmOWMwZTgzMWVmZjBmMmYxMDZiNjYyN2Y3ZDVhZDQwYjc3ZTIwMzRmMTQ5NmRjODVhYjM5ODNhZWE2MDhlZGMwM2FmMGE0NWVhMmI2MzBjMmFhOWU3ZmU1MjBjMDkxMTA2NGQzNjg5NWNhYjJiMDI1YmNiYzdkNDk5OTE1NjI2Mjk4YjI0NWE3OTY4YzI2NTJmNWRlYTE2MTIyMDUyOTZjZjljMzQ3NzkxNTZmNjVlNTVmOWNjYzUzYTFlZjI1NWI4ZTFiYWUxODFhMDI1ZjE2MDQxYjM5ZTJiYmZjZTk5YjU0Y2JjNjZjYjNmYmY5YmZkN2QwYTczMTQwNDFmNmFlM2QyMDE4NzUxODQ0MDM5ZWQ5NzlmMTg5NTlmMWQ3MjVhY2ZkZGEzYTFiNWVlNzk4NjI0NDFhNTRhNWUzMzI4ZTI5NzEzN2E5OTI5NTE1MDJkMDA4N2VhYzM2Zjg1ZWY3MDBkNmE0YWRmOGFmZGU1ZDRjNjc0YTViYjdhZDY0NmI5MTYxNGQ4OGQzOTBlYzFhNDQ5NGRlNGZjMzY5ZjczNDM0ZDEzYTZlMjQyNzk4OTRmOTdkZWZlZTZiNjdiOWRjOTAyZjg5NGZlMjIyNWJkMWU0ODE2OWYyZTE0MmZjYzgwYjY5OTIyMTVlNDMyMzI3MjQyYmY0NWUyMDQxODQ3ZDVmMzRjNzNkYzg2YjQwMmEwOWJlYzE2Y2NiNTAzNjljOThiNTU1MzZiNjFjMWVhYzQ4YmNkYWFmNmI2ZjJmODRiYmZifDE4MWVjYjhhMDBiNDVlODJkNjY1OGM3OTlkNWIxMmQzIiwiaWF0IjoxNzEyNTU3ODg5LCJleHAiOjE3MTI1NTk2ODl9.CuFWQ2WX6GsN6VmwoBXEbmVr20GDPXJ7_ZlQdM-jYE8' // Your token here
                }
            }
        };

        // Mocking the successful response for authentication
        axios.post.mockResolvedValue(mockResponse);

        // Call the authenticate method
        const response = await cmsClientInstance.authenticate({
            "mobileNumber": "+919700000001",
            "pin": "1234"
        });

        // Assertion
        expect(response).toBeTruthy();
        expect(response.token).toEqual(mockResponse.data.data.token);
    });
});
