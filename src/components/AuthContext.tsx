import React, { createContext, useContext, useState, ReactNode } from 'react';
import { auth } from '../services/api';

export type UserRole = 'Administrador' | 'Asesor' | 'Productor' | 'Repartidor' | 'Cliente';

export interface User {
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  foto?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Definición de permisos por rol
const rolePermissions: Record<UserRole, {
  modules: string[];
  actions: Record<string, string[]>;
}> = {
  Administrador: {
    modules: ['dashboard', 'usuarios', 'compras', 'produccion', 'ventas', 'configuracion'],
    actions: {
      '*': ['view', 'create', 'edit', 'delete', 'pdf', 'cancel']
    }
  },
  Asesor: {
    modules: ['dashboard', 'ventas', 'compras'],
    actions: {
      'ventas': ['view', 'create', 'edit', 'pdf'],
      'ventas/clientes': ['view', 'create', 'edit'],
      'ventas/ventas': ['view', 'create', 'pdf'],
      'ventas/pedidos': ['view', 'create', 'edit', 'pdf'],
      'ventas/abonos': ['view', 'create', 'pdf'],
      'ventas/domicilios': ['view'],
      'compras/productos': ['view']
    }
  },
  Productor: {
    modules: ['dashboard', 'produccion', 'compras'],
    actions: {
      'produccion': ['view', 'create', 'edit', 'pdf'],
      'produccion/insumos': ['view', 'create', 'edit'],
      'produccion/produccion': ['view', 'create', 'edit', 'pdf'],
      'compras/productos': ['view'],
      'compras/compras': ['view']
    }
  },
  Repartidor: {
    modules: ['dashboard', 'ventas'],
    actions: {
      'ventas/domicilios': ['view', 'edit'],
      'ventas/pedidos': ['view']
    }
  },
  Cliente: {
    modules: ['cliente'],
    actions: {
      'cliente': ['view', 'create', 'edit'],
      'cliente/tienda': ['view'],
      'cliente/pedidos': ['view', 'create'],
      'cliente/perfil': ['view', 'edit']
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await auth.login(email, password);
      if (result?.id && result?.email) {
        setUser({
          email: result.email,
          nombre: result.nombre,
          apellido: result.apellido,
          rol: result.rol as UserRole,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error de login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (module: string, action: string = 'view'): boolean => {
    if (!user) return false;

    const permissions = rolePermissions[user.rol];
    
    // Administrador tiene acceso total
    if (user.rol === 'Administrador') return true;

    // Verificar si tiene acceso al módulo base
    const moduleBase = module.split('/')[0];
    if (!permissions.modules.includes(moduleBase)) return false;

    // Verificar acción específica
    const moduleActions = permissions.actions[module] || permissions.actions[moduleBase] || [];
    return moduleActions.includes(action);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}