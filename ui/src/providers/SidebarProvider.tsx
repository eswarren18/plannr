import { createContext, useContext, ReactNode } from 'react';

const SidebarContext = createContext(false);

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
    collapsed: boolean;
    children: ReactNode;
}

export function SidebarProvider({ collapsed, children }: SidebarProviderProps) {
    return (
        <SidebarContext.Provider value={collapsed}>
            {children}
        </SidebarContext.Provider>
    );
}
