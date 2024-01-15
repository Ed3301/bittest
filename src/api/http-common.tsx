import axios from 'axios';

const http = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://test.gefara.xyz/api/v1',
    headers: {
        'Content-type': 'application/json'
    }
});

export default http;