import {ThemedView} from "@/components/ThemedView";
import {
    Box,
    Button,
    Center, extendTheme,
    FormControl,
    Heading,
    HStack,
    Input,
    Link as LinkNativeBase,
    NativeBaseProvider,
    Text,
    VStack
} from "native-base";
import styles from "./styles";
import {Link} from "expo-router";

export default function LoginScreen() {

    const theme = extendTheme({
        colors: {
            indigo: {
                50: '#ffbec1',
                100: '#fd989d',
                200: '#f8757c',
                300: '#f0555d',
                400: '#ed333b',
                500: '#e4222c',
                600: '#cd212a',
                700: '#b2252c',
                800: '#99262c',
                900: '#81272b',
            },
        },
    });

    return (
        <ThemedView style={styles.container}>
            <Center w="100%" height='100%'>
                <Box safeArea p="2" py="8" w="95%" maxW="380">
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>
                        Track<Text color='indigo.500' fontWeight='black'>&</Text>Trace
                    </Heading>
                    <Heading
                        mt="0.5"
                        _dark={{
                            color: "warmGray.200"
                        }}
                        color="coolGray.600"
                        fontWeight="extrabold"
                        size="sm"
                        borderLeftWidth={4}
                        paddingLeft={2}
                        borderLeftColor={"indigo.500"}
                        borderRadius={2}
                    >
                        Motorista
                    </Heading>

                    <VStack space={3} mt="5">
                        <FormControl>
                            <FormControl.Label>Login</FormControl.Label>
                            <Input/>
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Senha</FormControl.Label>
                            <Input type="password"/>
                            <LinkNativeBase _text={{
                                fontSize: "xs",
                                fontWeight: "500",
                                color: "indigo.500"
                            }} alignSelf="flex-end" mt="1">
                                Esqueceu sua senha?
                            </LinkNativeBase>
                        </FormControl>
                        <Link href={'/home'} asChild>
                            <Button mt="2" colorScheme="indigo">
                                Entrar
                            </Button>
                        </Link>
                    </VStack>
                </Box>
            </Center>
        </ThemedView>
    );
}
