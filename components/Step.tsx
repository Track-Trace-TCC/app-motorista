import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface StepProps {
    title: string;
    description: string;
    status: string;
}

const Step: React.FC<StepProps> = ({ title, description, status }) => {
    return (
        <View style={styles.stepContainer}>
            <MaterialIcons name="check-circle" size={24} color={status === 'concluida' ? 'green' : 'grey'} />
            <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>{title}</Text>
                <Text style={styles.stepDescription}>{description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    stepTextContainer: {
        marginLeft: 10,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    stepDescription: {
        fontSize: 14,
        color: 'grey',
    },
});

export default Step;
