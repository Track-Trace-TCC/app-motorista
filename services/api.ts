import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
const api = axios.create({
    baseURL: 'https://ccfe-177-203-139-185.ngrok-free.app'
})

api.interceptors.request.use(async (config: any) => {
    config.headers = config.headers || {};
    console.log(API_URL)
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Erro ao obter o token do AsyncStorage', error);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                await AsyncStorage.removeItem('token');
            } catch (e) {
                console.error('Erro ao remover o token do AsyncStorage', e);
            }

        }
        return Promise.reject(error);
    }
);

export default api;