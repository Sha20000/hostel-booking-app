import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://innovative-clarity-production-bf82.up.railway.app/api';
export const SERVER_URL = 'https://innovative-clarity-production-bf82.up.railway.app';


const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config)=>{

    const token = await AsyncStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

})


export default api;

