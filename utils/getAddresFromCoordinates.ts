import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env'
export const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);
        if (response.data.status === 'OK') {
            const address = response.data.results[0].formatted_address;
            return address;
        } else {
            throw new Error('Não foi possível obter o endereço.');
        }
    } catch (error) {
        console.error('Erro ao obter o endereço:', error);
        return 'Endereço não encontrado';
    }
};
