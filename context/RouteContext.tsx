import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Route {
    id: string;
    name: string;
    source: {
        lat: string;
        lng: string;
    };
    destination: {
        lat: string;
        lng: string;
    };
    status: string;
    directions: any;
    motorista: {
        id_Motorista: string;
        nome: string;
        cnh: string;
        email: string;
    };
}

interface RouteContextType {
    route: Route | null;
    setRoute: (route: Route) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider = ({ children }: { children: ReactNode }) => {
    const [route, setRoute] = useState<Route | null>(null);

    return (
        <RouteContext.Provider value={{ route, setRoute }}>
            {children}
        </RouteContext.Provider>
    );
};

export const useRoute = (): RouteContextType => {
    const context = useContext(RouteContext);
    if (!context) {
        throw new Error('useRoute must be used within a RouteProvider');
    }
    return context;
};
