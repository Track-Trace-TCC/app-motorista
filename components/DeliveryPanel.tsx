import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Alert, ListRenderItem } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import SwipeButton from 'rn-swipe-button';
import { usePackages } from '@/context/PackageContext';
import { useRoute } from '@/context/RouteContext';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

type AddressMap = {
    [key: string]: string;
};

interface Package {
    id: string;
    status: string;
    cliente: {
        nome: string;
    };
    codigo_Rastreio: string;
}

interface DeliveryPanelProps {
    addresses: AddressMap;
}

const DeliveryPanel: React.FC<DeliveryPanelProps> = ({ addresses }) => {
    const { packages, setPackages } = usePackages();
    const { route, setRoute } = useRoute();
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCompleteDelivery = async () => {
        setLoading(true);
        const nextPackageIndex = packages.findIndex(pkg => pkg.status === 'A_CAMINHO');
        if (nextPackageIndex !== -1) {
            const packageId = packages[nextPackageIndex].id;
            try {
                await api.patch(`/package/${packageId}/finish-delivery`);
                const updatedPackages = [...packages];
                updatedPackages[nextPackageIndex].status = 'ENTREGUE';
                setPackages(updatedPackages);
            } catch (error) {
                console.log(error)
                Alert.alert('Erro', 'Não foi possível finalizar a entrega.');
            }
        } else {
            try {
                await api.patch(`/routes/${route?.id}`);
                Alert.alert('Rota finalizada', 'Todas as entregas foram concluídas.');
                AsyncStorage.removeItem('route');
                setRoute(null);
                setPackages([]);
            } catch (error) {
                console.log(error)
                Alert.alert('Erro', 'Não foi possível finalizar a rota.');
            }
        }
        setLoading(false);
    };

    const getStepColor = (status: string, index: number): string => {
        if (status === 'ENTREGUE') {
            return 'green';
        } else if (status === 'A_CAMINHO' && index === packages.findIndex(pkg => pkg.status === 'A_CAMINHO')) {
            return 'blue';
        } else {
            return 'gray';
        }
    };

    const getStatusLabel = (status: string, index: number): string => {
        if (status === 'A_CAMINHO' && index === packages.findIndex(pkg => pkg.status === 'A_CAMINHO')) {
            return 'Próxima entrega';
        } else if (status === 'ENTREGUE') {
            return 'Entregue';
        } else if (status === 'A_CAMINHO') {
            return 'Em andamento';
        } else {
            return 'Aguardando';
        }
    };

    const renderItem: ListRenderItem<Package> = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <View style={styles.stepContainer}>
                <View style={[styles.step, { backgroundColor: getStepColor(item.status, index) }]} />
                {index !== packages.length - 1 && <View style={styles.stepLine} />}
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>
                    {getStatusLabel(item.status, index)}
                </Text>
                <Text style={styles.itemText}>
                    Entrega {item.id}
                </Text>
                <Text style={styles.itemText}>
                    {addresses[item.id] || 'Carregando...'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.panel, expanded ? styles.expandedPanel : styles.collapsedPanel]}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.toggleContainer}>
                <AntDesign name={expanded ? "down" : "up"} size={24} color="black" />
            </TouchableOpacity>
            {expanded && (
                <FlatList
                    data={packages}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 16, minHeight: 100 }}
                />
            )}
            <SwipeButton
                containerStyles={styles.swipeButtonContainer}
                railBackgroundColor="#FF3B30"
                railFillBackgroundColor="#FF3B30"
                railFillBorderColor="#FF3B30"
                thumbIconBackgroundColor="#FF3B30"
                thumbIconBorderColor="#FF3B30"
                railBorderColor="#FF3B30"
                title={packages.some(pkg => pkg.status !== 'ENTREGUE') ? 'Finalizar entrega' : 'Finalizar Rota'}
                titleColor="#FFF"
                titleStyles={{ fontSize: 16 }}
                onSwipeSuccess={handleCompleteDelivery}
                resetAfterSuccess={true}
                shouldResetAfterSuccess
                resetAfterSuccessAnimDuration={100}
                thumbIconComponent={() => <AntDesign name="arrowright" size={24} color="white" />}
                disabled={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    panel: {
        position: 'absolute',
        bottom: 0,
        width: width,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: height * 0.8,
    },
    expandedPanel: {
        height: height * 0.6,
    },
    collapsedPanel: {
        height: 60,
    },
    toggleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemText: {
        fontSize: 14,
        color: '#555',
    },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    step: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    stepLine: {
        width: 2,
        flex: 1,
        backgroundColor: 'gray',
    },
    swipeButtonContainer: {
        marginTop: 16,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        height: 60,
    },
});

export default DeliveryPanel;
