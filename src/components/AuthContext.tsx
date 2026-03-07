import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, subscribeApiUnauthorized } from '../services/api';

export type UserRole = 'Administrador' | 'Asesor' | 'Productor' | 'Repartidor' | 'Cliente';

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  foto?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  sessionWarningVersion: number;
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [sessionExpiresAtMs, setSessionExpiresAtMs] = useState<number | null>(null);
  const [sessionWarningVersion, setSessionWarningVersion] = useState(0);

  const mapUser = (result: any): User | null => {
    if (!result?.id || !result?.email) {
      return null;
    }

    return {
      id: Number(result.id),
      email: result.email,
      nombre: result.nombre,
      apellido: result.apellido,
      rol: result.rol as UserRole,
    };
  };

  const resolveSessionExpiresAt = (result: any): number | null => {
    if (!result) return null;

    if (typeof result.session_expires_at === 'string') {
      const timestamp = Date.parse(result.session_expires_at);
      if (!Number.isNaN(timestamp)) {
        return timestamp;
      }
    }

    if (typeof result.expires_in_ms === 'number') {
      return Date.now() + result.expires_in_ms;
    }

    return null;
  };

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const result = await auth.me();
        if (isMounted) {
          setUser(mapUser(result));
          setSessionExpiresAtMs(resolveSessionExpiresAt(result));
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setSessionExpiresAtMs(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return subscribeApiUnauthorized(() => {
      setUser(null);
      setSessionExpiresAtMs(null);
    });
  }, []);

  useEffect(() => {
    if (!user || !sessionExpiresAtMs) {
      return;
    }

    const millisecondsUntilExpiry = sessionExpiresAtMs - Date.now();
    if (millisecondsUntilExpiry <= 0) {
      setUser(null);
      setSessionExpiresAtMs(null);
      return;
    }

    const warningInMs = millisecondsUntilExpiry - 30_000;

    const warningTimer = setTimeout(
      () => {
        setSessionWarningVersion((current) => current + 1);
      },
      Math.max(0, warningInMs)
    );

    const expiryTimer = setTimeout(() => {
      auth.logout().catch(() => {
        // Session may already be expired server-side.
      });
      setUser(null);
      setSessionExpiresAtMs(null);
    }, millisecondsUntilExpiry);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(expiryTimer);
    };
  }, [user?.id, sessionExpiresAtMs]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await auth.login(email, password);
      const mappedUser = mapUser(result);
      if (mappedUser) {
        setUser(mappedUser);
        setSessionExpiresAtMs(resolveSessionExpiresAt(result));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error de login:', error);
      return false;
    }
  };

  const logout = () => {
    auth.logout().catch(() => {
      // Ensure local state is cleared even if backend logout fails.
    });
    setUser(null);
    setSessionExpiresAtMs(null);
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
    <AuthContext.Provider value={{ user, isAuthLoading, sessionWarningVersion, login, logout, hasPermission }}>
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