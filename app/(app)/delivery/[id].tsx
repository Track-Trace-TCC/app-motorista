import {styles} from './styles';
import {ThemedView} from "@/components/ThemedView";
import React from "react";
import {Actionsheet, Box, Button, Center, useDisclose, Text} from "native-base";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams} from "expo-router";

export default function DeliveryScreen() {
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();

    const {id} = useLocalSearchParams();

    console.log(id);

    return (
        <SafeAreaView>
            <Text>Delivery Screen Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est exercitationem facilis
                nihil provident reiciendis ut voluptatibus. Ab adipisci architecto assumenda, distinctio, dolor dolore
                iste, nam natus obcaecati odit recusandae totam?</Text>
            {/*<ThemedView style={styles.container}>*/}
            {/*    <Center>*/}
            {/*        <Actionsheet isOpen={isOpen} onClose={onClose}>*/}
            {/*            <Actionsheet.Content>*/}
            {/*                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores at autem debitis*/}
            {/*                delectus*/}
            {/*                dicta eius est eum, exercitationem facere facilis ipsam maxime molestias quae similique*/}
            {/*                sint,*/}
            {/*                soluta unde ut, vero!*/}
            {/*            </Actionsheet.Content>*/}
            {/*        </Actionsheet>*/}
            {/*    </Center>*/}
            {/*    <Text>Delivery Screen</Text>*/}
            {/*</ThemedView>*/}
        </SafeAreaView>
    );
}


