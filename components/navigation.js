import { Linking } from 'react-native';

export const navigateToDestination = (origin, destination) => {
    const url = `google.navigation:q=${destination.lat},${destination.lng}&mode=d`;
    Linking.openURL(url).catch(err => {
        Alert.alert('Erro', 'Não foi possível iniciar a navegação');
    });
};
