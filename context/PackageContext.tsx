import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Package {
    id: string;
    origem: {
        latitude: string;
        longitude: string;
    };
    destino: string;
    status: string;
    codigo_Rastreio: string;
    data_Criacao: string;
    data_Atualizacao: string;
    cliente: {
        id: string;
        nome: string;
        cpf: string;
        email: string;
    };
    motorista: {
        id: string;
        nome: string;
        cnh: string;
        email: string;
    };
    data_Entrega: string;
}

interface PackageContextType {
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [packages, setPackages] = useState<Package[]>([]);

    return (
        <PackageContext.Provider value={{ packages, setPackages }}>
            {children}
        </PackageContext.Provider>
    );
};

export const usePackages = (): PackageContextType => {
    const context = useContext(PackageContext);
    if (!context) {
        throw new Error('usePackages must be used within a PackageProvider');
    }
    return context;
};
