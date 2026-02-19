import axios from 'axios';

const api = axios.create({
    // Certifique-se de que a porta 7170 é a mesma do seu Swagger
    baseURL: 'https://crud-generator-api-onuw.onrender.com/api', // RENDER
   // baseURL: 'https://localhost:7170/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;