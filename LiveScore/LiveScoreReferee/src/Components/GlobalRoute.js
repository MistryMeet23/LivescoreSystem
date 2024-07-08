import axios from 'axios';

const globalRoute = axios.create({
    baseURL: '/api',
});

export default globalRoute;