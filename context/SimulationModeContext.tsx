import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SimulationModeContextType = {
    isSimulationMode: boolean;
    toggleSimulationMode: () => void;
};

const SimulationModeContext = createContext<SimulationModeContextType | undefined>(undefined);

interface SimulationModeProviderProps {
    children: ReactNode;
}

export const SimulationModeProvider: React.FC<SimulationModeProviderProps> = ({ children }) => {
    const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);

    useEffect(() => {
        const loadSimulationMode = async () => {
            const storedValue = await AsyncStorage.getItem('simulationMode');
            if (storedValue !== null) {
                setIsSimulationMode(JSON.parse(storedValue));
            }
        };
        loadSimulationMode();
    }, []);

    const toggleSimulationMode = async () => {
        const newValue = !isSimulationMode;
        setIsSimulationMode(newValue);
        await AsyncStorage.setItem('simulationMode', JSON.stringify(newValue));
    };

    return (
        <SimulationModeContext.Provider value={{ isSimulationMode, toggleSimulationMode }}>
            {children}
        </SimulationModeContext.Provider>
    );
};

export const useSimulationMode = () => {
    const context = useContext(SimulationModeContext);
    if (!context) {
        throw new Error('useSimulationMode must be used within a SimulationModeProvider');
    }
    return context;
};
