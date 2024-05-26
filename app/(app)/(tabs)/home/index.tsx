import { ThemedView } from '@/components/ThemedView';
import { styles } from './styles';
import { Box, HStack, Icon, Input, VStack, Text } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { usePackages } from '@/context/PackageContext';
import { getAddressFromCoordinates } from '@/utils/getAddresFromCoordinates';
import { SwipeListView } from 'react-native-swipe-list-view';

interface Route {
    id: string;
    name: string;
    source: {
        lat: string;
        lng: string;
    }
    destination: {
        lat: string;
        lng: string;
    }
    status: string;
    directions: any;
    motorista: {
        id: string;
        nome: string;
        cnh: string;
        email: string;
    }
}

interface Package {
    id: string;
    origem: {
        latitude: string;
        longitude: string;
    };
    destino: string;
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
}

export default function HomeScreen() {
    const [id, setId] = useState<string | null>(null);
    const [routes, setRoutes] = useState<Route>();
    const { packages, setPackages } = usePackages();
    const [addresses, setAddresses] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        AsyncStorage.getItem('id').then((id) => {
            setId(id);
        });
    }, []);

    useEffect(() => {
        async function fetchActiveRoutes() {
            try {
                const response: Route = await api.get('/routes/active/' + id);
                setRoutes(response);
            } catch (error) {
                console.log('Erro ao buscar as rotas', error);
            }
        }
        if (id) {
            fetchActiveRoutes();
        }
    }, [id]);

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
                                            Motorista: {item.motorista.nome}
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
        </ThemedView>
    );
}
