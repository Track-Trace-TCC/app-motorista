import { ThemedText } from '@/components/ThemedText';
import { styles } from './styles';
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect } from "react";
import { Avatar, Box, CheckIcon, Heading, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfileScreen() {
    const [name, setName] = React.useState<string | null>(null);
    const [id, setId] = React.useState<string | null>(null);
    const [twoFirstLetters, setTwoFirstLetters] = React.useState<string | null>(null);
    useEffect(() => {
        AsyncStorage.getItem('name').then((name) => {
            setName(name);
        });
        AsyncStorage.getItem('id').then((id) => {
            setId(id);
        });
    }, [AsyncStorage])

    useEffect(() => {
        if (name) {
            setTwoFirstLetters(name.substring(0, 2).toLocaleUpperCase());
        }
    }, [name])
    console.log(name)
    return (
        <ThemedView style={styles.container}>
            <HStack pl="4" space={'xs'} alignItems='center'>
                <Avatar
                    bg="amber.500"
                    size={'lg'}
                >
                    {twoFirstLetters}
                </Avatar>
                <VStack>
                    <Heading size='md' color='gray.800'>{name}</Heading>
                    <Text color='gray.500' fontSize='sm'>{id}</Text>
                </VStack>
            </HStack>

            <TouchableOpacity>
                <HStack space={1.5} pl="4" mt='7' alignItems={'center'}>
                    <Ionicons name="settings-sharp" size={18} color="gray.700" />
                    <Text color="gray.700" fontSize="md">
                        Configurações
                    </Text>
                </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
                <HStack space={1.5} pl="4" mt='3' alignItems={'center'}>
                    <Ionicons name="notifications-sharp" size={18} color="gray.700" />
                    <Text color="gray.700" fontSize="md">
                        Notificações
                    </Text>
                </HStack>
            </TouchableOpacity>
        </ThemedView>
    );
}


