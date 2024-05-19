import {ThemedView} from '@/components/ThemedView';
import {styles} from './styles';
import {Avatar, Box, FlatList, Heading, HStack, Icon, Input, Spacer, VStack, Text} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";
import React from "react";
import {TouchableOpacity} from "react-native";
import {Link} from "expo-router";

export default function HomeScreen() {
    const data = [{
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        fullName: "Aafreen Khan",
        timeStamp: "12:47 PM",
        recentText: "Good Day!",
        inTransit: true,
        avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    }, {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        fullName: "Sujitha Mathur",
        timeStamp: "11:11 PM",
        recentText: "Cheer up, there!",
        inTransit: false,
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU"
    }, {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        fullName: "Anci Barroco",
        timeStamp: "6:22 PM",
        recentText: "Good Day!",
        inTransit: false,
        avatarUrl: "https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg"
    }, {
        id: "68694a0f-3da1-431f-bd56-142371e29d72",
        fullName: "Aniket Kumar",
        timeStamp: "8:56 PM",
        recentText: "All the best",
        inTransit: false,
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU"
    }, {
        id: "28694a0f-3da1-471f-bd96-142456e29d72",
        fullName: "Kiara",
        timeStamp: "12:47 PM",
        recentText: "I will call today.",
        inTransit: false,
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
    },
        {
            id: "28694afefe0f-3da1-471f-bd96-142456e29d72",
            fullName: "Kiara",
            timeStamp: "12:47 PM",
            inTransit: false,
            recentText: "I will call today.",
            avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU"
        }];

    return (
        <ThemedView style={styles.container}>
            <Input
                InputLeftElement={
                    <Icon
                        as={<MaterialIcons name="search"/>}
                        size={5}
                        ml="2"
                        color="muted.800"/>
                }
                variant="filled"
                placeholder="Código da entrega"
            />

            <Box marginTop={'6'}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => <Box height={7}/>}
                    renderItem={({item}) =>
                        <Link href={'/delivery/' + item.id} asChild>
                            <TouchableOpacity>
                                <Box
                                    borderBottomWidth="1"
                                    _dark={{
                                        borderColor: "muted.50"
                                    }}
                                    borderColor="muted.100"
                                    py="4"
                                    flexDirection="row"
                                    flex={1}
                                >
                                    <Box
                                        width={'2'}
                                        py={'2'}
                                        borderRadius={'full'}
                                        background={item.inTransit ? 'indigo.500' : 'coolGray.200'}
                                        marginRight={'4'}
                                    />
                                    <HStack
                                        space={[2, 3]}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        py={'2'}
                                        flex={1}
                                    >
                                        <VStack
                                            width={(100 - 20) + '%'}
                                            flex={1}
                                        >
                                            <Text
                                                _dark={{
                                                    color: "warmGray.50"
                                                }}
                                                color="indigo.800"
                                                fontSize={"sm"}
                                                bold
                                                marginBottom={'1'}
                                            >
                                                {item.fullName}
                                            </Text>
                                            <Text
                                                fontSize={"lg"}
                                                color="coolGray.800"
                                                _dark={{
                                                    color: "warmGray.200"
                                                }}
                                            >
                                                {item.recentText}
                                            </Text>
                                            <Text
                                                fontSize={"sm"}
                                                color="coolGray.500"
                                                _dark={{
                                                    color: "warmGray.200"
                                                }}
                                            >
                                                Av. T2 - Quadra 107, Lote 07 - Setor Bueno. Referência: Em frente ao
                                                Hospital do Coração.
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
                                    </HStack>
                                </Box>
                            </TouchableOpacity>
                        </Link>
                    }
                    keyExtractor={item => item.id}/>
            </Box>
        </ThemedView>
    );
}


