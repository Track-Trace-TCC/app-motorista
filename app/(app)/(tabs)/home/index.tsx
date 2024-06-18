import React, { useEffect, useState, useRef } from "react";
import { Dimensions, TouchableOpacity, Alert } from "react-native";
import { ThemedView } from '@/components/ThemedView';
import { styles } from './styles';
import { Box, Icon, Input, VStack, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { usePackages } from '@/context/PackageContext';
import { getAddressFromCoordinates } from '@/utils/getAddresFromCoordinates';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useRoute } from '@/context/RouteContext';
import MapWebView from '@/components/MapWebView'; // Ajuste o caminho conforme necessário
import { Linking } from 'react-native';
import DeliveryPanel from "@/components/DeliveryPanel";
import socket from '@/lib/socket'; // Importar o socket
import { useSimulationMode } from '@/context/SimulationModeContext';
import * as Location from 'expo-location';

type LatLng = {
    lat: number;
    lng: number;
};

type Route = {
    id: string;
    name: string;
    source: LatLng;
    destination: LatLng;
    status: string;
    directions: any;
    motorista: {
        id: string;
        nome: string;
        cnh: string;
        email: string;
    };
};

type Package = {
    id: string;
    origem: LatLng;
    destino: LatLng;
    status: string;
    codigo_Rastreio: string;
    data_Criacao: string;
    data_Atualizacao: string;
    cliente: {
        id: string;
        nome: string;
        cpf: string;
        email: string;
    };
    motorista: {
        id: string;
        nome: string;
        cnh: string;
        email: string;
    };
    data_Entrega: string;
};

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function HomeScreen() {
    const [id, setId] = useState<string | null>(null);
    const { packages, setPackages } = usePackages();
    const { route, setRoute } = useRoute();
    const [addresses, setAddresses] = useState<{ [key: string]: string }>({});
    const [mapReady, setMapReady] = useState(false);
    const { isSimulationMode } = useSimulationMode();
    const mapRef = useRef(null);

    useEffect(() => {
        AsyncStorage.getItem('id').then((id) => {
            setId(id);
        });
    }, []);

    useEffect(() => {
        async function fetchActiveRoutes() {
            try {
                const response = await api.get(`/routes/active/${id}`);
                setRoute(response.data);
            } catch (error) {
                console.log('Erro ao buscar as rotas', error);
            }
        }
        if (id) {
            fetchActiveRoutes();
        }
    }, [id]);

    useEffect(() => {
        async function fetchPackages() {
            if (route?.motorista?.id_Motorista) {
                const response = await api.get(`/package/driver/${route.motorista.id_Motorista}/route/${route.id}`);
                let fetchedPackages = response.data;
                const sortedPackages = fetchedPackages.sort((a: Package, b: Package) => {
                    const aDest = JSON.parse(a.destino);
                    const bDest = JSON.parse(b.destino);

                    const aLatLng = `${parseFloat(aDest.latitude).toFixed(2)},${parseFloat(aDest.longitude).toFixed(2)}`;
                    const bLatLng = `${parseFloat(bDest.latitude).toFixed(2)},${parseFloat(bDest.longitude).toFixed(2)}`;

                    const aIndex = route.directions.routes[0].legs.findIndex((leg: any) =>
                        `${parseFloat(leg.end_location.lat).toFixed(2)},${parseFloat(leg.end_location.lng).toFixed(2)}` === aLatLng);
                    const bIndex = route.directions.routes[0].legs.findIndex((leg: any) =>
                        `${parseFloat(leg.end_location.lat).toFixed(2)},${parseFloat(leg.end_location.lng).toFixed(2)}` === bLatLng);

                    return aIndex - bIndex;
                });

                setPackages(sortedPackages);
            }
        }
        if (route) {
            setMapReady(true);
            if (packages.length === 0) {
                fetchPackages();
            }
        }
    }, [route]);

    useEffect(() => {
        async function fetchAddresses() {
            const newAddresses: { [key: string]: string } = {};
            for (const pkg of packages) {
                const destination = JSON.parse(pkg.destino);
                const address = await getAddressFromCoordinates(destination.latitude, destination.longitude);
                newAddresses[pkg.id] = address;
            }
            setAddresses(newAddresses);
        }

        if (packages.length > 0) {
            fetchAddresses();
        }
    }, [packages]);

    const handleDeletePackage = (packageId: string) => {
        setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== packageId));
    };

    const handleNavigate = (data: { url: string }) => {
        if (data.url) {
            Linking.openURL(data.url).catch(err => {
                Alert.alert('Erro', 'Não foi possível iniciar a navegação');
            });
        }
    };


    const shareLocation = async () => {
        if (isSimulationMode) {
            socket.connect();
            for (const leg of route?.directions.routes[0].legs) {
                for (const step of leg.steps) {
                    await sleep(2000);
                    mapRef.current?.moveCar(step.start_location);
                    socket.emit("new-points", {
                        route_id: route?.id,
                        driver_id: id,
                        lat: step.start_location.lat,
                        lng: step.start_location.lng,
                    });
                    await sleep(2000);
                    mapRef.current?.moveCar(step.end_location);
                    socket.emit("new-points", {
                        route_id: route?.id,
                        driver_id: id,
                        lat: step.end_location.lat,
                        lng: step.end_location.lng,
                    });
                }
            }
        } else {
            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000,
                    distanceInterval: 1,
                },
                (position) => {
                    mapRef.current?.moveCar({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    socket.emit("new-points", {
                        route_id: route?.id,
                        driver_id: id,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                }
            );
        }
    };

    useEffect(() => {
        if (route) {
            shareLocation();
        }
    }, [route, isSimulationMode]);

    return (
        <ThemedView style={styles.container}>
            <Input
                InputLeftElement={
                    <Icon
                        as={<MaterialIcons name="search" />}
                        size={5}
                        ml="2"
                        color="muted.800" />
                }
                variant="filled"
                placeholder="Código da entrega"
            />

            {route && mapReady ? (
                <>
                    <MapWebView
                        ref={mapRef}
                        route={route}
                        onMessage={handleNavigate}
                    />
                    <DeliveryPanel addresses={addresses} />
                </>
            ) : (
                <Box marginTop={'6'}>
                    <SwipeListView
                        data={packages}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Link href={'/delivery/' + item.id} asChild>
                                <TouchableOpacity>
                                    <Box
                                        borderBottomWidth="1"
                                        _dark={{
                                            borderColor: "muted.50"
                                        }}
                                        borderColor="muted.100"
                                        py="4"
                                        px="4"
                                        flexDirection="row"
                                        flex={1}
                                        borderRadius="md"
                                        bg="white"
                                        shadow="2"
                                        marginBottom="4"
                                    >
                                        <VStack space={2} flex={1}>
                                            <Text
                                                fontSize="md"
                                                bold
                                                _dark={{
                                                    color: "warmGray.50"
                                                }}
                                                color="indigo.800"
                                            >
                                                Cliente: {item.cliente.nome}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                _dark={{
                                                    color: "warmGray.200"
                                                }}
                                                color="coolGray.800"
                                            >
                                                Código de Rastreamento: {item.codigo_Rastreio}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                _dark={{
                                                    color: "warmGray.200"
                                                }}
                                                color="coolGray.800"
                                            >
                                                Status: {item.status}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                _dark={{
                                                    color: "warmGray.200"
                                                }}
                                                color="coolGray.800"
                                            >
                                                Destino: {addresses[item.id] || 'Carregando...'}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                _dark={{
                                                    color: "warmGray.200"
                                                }}
                                                color="coolGray.800"
                                            >
                                                Motorista: {item?.motorista?.nome ?? 'Não vinculado'}
                                            </Text>
                                        </VStack>
                                        <MaterialIcons
                                            name="keyboard-arrow-right"
                                            size={26}
                                            color={'#858484'}
                                            _dark={{
                                                color: "warmGray.50"
                                            }}
                                        />
                                    </Box>
                                </TouchableOpacity>
                            </Link>
                        )}
                        renderHiddenItem={() => (
                            <Box
                                flex={1}
                                flexDirection="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                pr={4}
                                bg="red.600"
                                borderRadius="md"
                                marginBottom="4"
                            >
                                <Text color="white" fontWeight="bold">Deletar</Text>
                            </Box>
                        )}
                        leftOpenValue={0}
                        rightOpenValue={-100}
                        disableRightSwipe
                        removeClippedSubviews
                        onRowOpen={(rowKey, rowMap) => {
                            setTimeout(() => {
                                rowMap[rowKey].closeRow();
                                handleDeletePackage(rowKey);
                            }, 200);
                        }}
                    />
                </Box>
            )}

        </ThemedView>
    );
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
