import {ThemedText} from '@/components/ThemedText';
import {styles} from './styles';
import {ThemedView} from "@/components/ThemedView";
import React from "react";
import {Avatar, Box, CheckIcon, Heading, HStack, Text, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import {Ionicons} from '@expo/vector-icons';


export default function ProfileScreen() {
    return (
        <ThemedView style={styles.container}>
            <HStack pl="4" space={'xs'} alignItems='center'>
                <Avatar
                    bg="amber.500"
                    size={'lg'}
                    source={{
                        uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    }}>
                    TS
                </Avatar>
                <VStack>
                    <Heading size='md' color='gray.800'>Gabriel Leles</Heading>
                    <Text color='gray.500' fontSize='sm'>@gabrielleles</Text>
                </VStack>
            </HStack>

            <TouchableOpacity>
                <HStack space={1.5} pl="4" mt='7' alignItems={'center'}>
                    <Ionicons name="settings-sharp" size={18} color="gray.700"/>
                    <Text color="gray.700" fontSize="md">
                        Configurações
                    </Text>
                </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
                <HStack space={1.5} pl="4" mt='3' alignItems={'center'}>
                    <Ionicons name="notifications-sharp" size={18} color="gray.700"/>
                    <Text color="gray.700" fontSize="md">
                        Notificações
                    </Text>
                </HStack>
            </TouchableOpacity>
        </ThemedView>
    );
}


