
import React, { useState } from 'react';
import { Box, Button, Center, FormControl, Heading, Input, Spinner, VStack, Text } from 'native-base';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/driver', {
                email: login,
                password: password
            });

            const { access_token, name, id } = response.data;

            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('id', id);
            await signIn(access_token);
            setError('');
            router.push('/home');
        } catch (error) {
            setError('Email ou senha incorreta');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Center w="100%" height="100%">
            <Box safeArea p="2" py="8" w="95%" maxW="380">
                <Heading size="lg" fontWeight="600" color="coolGray.800">
                    Track<Text color="indigo.500" fontWeight="black">&</Text>Trace
                </Heading>
                <Heading
                    mt="0.5"
                    color="coolGray.600"
                    fontWeight="extrabold"
                    size="sm"
                    borderLeftWidth={4}
                    paddingLeft={2}
                    borderLeftColor="indigo.500"
                    borderRadius={2}
                >
                    Motorista
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl isInvalid={!!error}>
                        <FormControl.Label>Login</FormControl.Label>
                        <Input
                            value={login}
                            onChangeText={setLogin}
                            borderColor={error ? 'red.500' : 'coolGray.300'}
                        />
                    </FormControl>
                    <FormControl isInvalid={!!error}>
                        <FormControl.Label>Senha</FormControl.Label>
                        <Input
                            type="password"
                            value={password}
                            onChangeText={setPassword}
                            borderColor={error ? 'red.500' : 'coolGray.300'}
                        />
                        {error && (
                            <FormControl.ErrorMessage>
                                {error}
                            </FormControl.ErrorMessage>
                        )}
                    </FormControl>
                    <Button mt="2" colorScheme="indigo" onPress={handleLogin} isDisabled={isLoading}>
                        {isLoading ? <Spinner color="white" /> : 'Entrar'}
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
};

export default LoginScreen;
