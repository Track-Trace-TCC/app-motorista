import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import * as Location from 'expo-location';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '@/services/api';
import { usePackages } from '@/context/PackageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { packages, setPackages } = usePackages();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showToast('Permissão de localização não concedida', 'error');
                return;
            }
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
        setScanned(true);
        setModalVisible(false);

        if (validateUUID(data)) {
            if (packages.some(pkg => pkg.id === data)) {
                showToast('Pacote já vinculado!', 'warning');
            } else {
                try {
                    const response = await api.get(`/package/${data}`);
                    const newPackage = response.data;
                    setPackages(prevPackages => [...prevPackages, newPackage]);
                    showToast('Pacote vinculado com sucesso!', 'success');
                } catch (error) {
                    showToast('Erro ao vincular pacote', 'error');
                }
            }
        } else {
            showToast('Código inválido', 'error');
        }
        setScanned(false);
    };

    const validateUUID = (uuid: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    };

    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        Toast.show({
            type,
            text1: message,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            topOffset: 40,
        });
    };

    const iniciarEntregas = async () => {
        try {
            setLoading(true);

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 1000,
            });
            const localizacao = {
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString(),
            };

            const idMotorista = await AsyncStorage.getItem('id');

            const packagesIds = packages.map(pkg => pkg.id);

            await api.patch('/package/associate-driver', {
                idMotorista,
                packages_ids: packagesIds,
                localizacao,
            });

            const destinos = packages.map(pkg => {
                const destino = JSON.parse(pkg.destino);
                return {
                    lat: destino.latitude.toString(),
                    lng: destino.longitude.toString(),
                };
            });

            await api.post('/routes', {
                idMotorista,
                origem: {
                    lat: localizacao.latitude,
                    lng: localizacao.longitude,
                },
                destinos,
            });

            showToast('Entregas iniciadas com sucesso!', 'success');
        } catch (error) {
            console.log(error);
            showToast('Erro ao iniciar entregas', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    tabBarStyle: {
                        height: 60,
                    },
                    tabBarLabelStyle: {
                        marginBottom: 6,
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Entregas',
                        tabBarIcon: ({ color }: { color: string }) => (
                            <TabBarIcon name={'package-variant'} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Conta',
                        tabBarIcon: ({ color }: { color: string }) => (
                            <TabBarIcon name={'account'} color={color} />
                        ),
                    }}
                />
            </Tabs>
            <TouchableOpacity style={styles.fabContainer} onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons name="camera-outline" size={28} color="black" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    >
                        <View style={styles.qrCodeContainer}>
                            <View style={styles.qrCodeSquare} />
                        </View>
                    </BarCodeScanner>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <View style={styles.toastContainer}>
                <Toast
                    config={{
                        success: (internalState) => (
                            <BaseToast
                                {...internalState}
                                style={{ borderLeftColor: 'green' }}
                                contentContainerStyle={{ paddingHorizontal: 15 }}
                                text1Style={{
                                    fontSize: 15,
                                    fontWeight: 'bold'
                                }}
                            />
                        ),
                        error: (internalState) => (
                            <ErrorToast
                                {...internalState}
                                style={{ borderLeftColor: 'red' }}
                                contentContainerStyle={{ paddingHorizontal: 15 }}
                                text1Style={{
                                    fontSize: 15,
                                    fontWeight: 'bold'
                                }}
                            />
                        ),
                        warning: (internalState) => (
                            <BaseToast
                                {...internalState}
                                style={{ borderLeftColor: 'orange' }}
                                contentContainerStyle={{ paddingHorizontal: 15 }}
                                text1Style={{
                                    fontSize: 15,
                                    fontWeight: 'bold'
                                }}
                            />
                        )
                    }}
                />
            </View>

            {packages.length > 0 && (
                <TouchableOpacity style={styles.floatingButton} onPress={iniciarEntregas}>
                    <Text style={styles.floatingButtonText}>Iniciar entregas</Text>
                </TouchableOpacity>
            )}

            <Spinner
                visible={loading}
                textContent={'Iniciando entregas...'}
                textStyle={styles.spinnerTextStyle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#DCDCE0',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    qrCodeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrCodeSquare: {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#00FF00',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    closeButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#000',
        fontSize: 16,
    },
    toastContainer: {
        zIndex: 9999,
        elevation: 9999,
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 100,
        left: '5%',
        right: '5%',
        backgroundColor: '#B3E145',
        paddingVertical: 10,
        borderRadius: 10,
        zIndex: 10000,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
});
