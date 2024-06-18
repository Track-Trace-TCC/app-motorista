import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const api = axios.create({
    baseURL: 'http://35.196.84.245'
})

api.interceptors.request.use(async (config: any) => {
    config.headers = config.headers || {};
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