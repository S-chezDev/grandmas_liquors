import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, subscribeApiUnauthorized } from '../services/api';

export type UserRole = 'Administrador' | 'Asesor' | 'Productor' | 'Repartidor' | 'Cliente';

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  permisos?: string[];
  foto?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  sessionWarningVersion: number;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthLoginResult>;
  logout: () => void;
  hasPermission: (module: string, action?: string) => boolean;
}

export interface AuthLoginResult {
  success: boolean;
  message?: string;
  status?: number;
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
    modules: ['dashboard', 'ventas/clientes', 'ventas/ventas', 'ventas/abonos', 'ventas/pedidos', 'ventas/domicilios', 'compras/proveedores', 'compras/compras', 'compras/productos', 'compras/categorias'],
    actions: {
      'ventas/clientes': ['view', 'create', 'edit'],
      'ventas/ventas': ['view', 'create', 'pdf'],
      'ventas/pedidos': ['view', 'create', 'edit', 'pdf'],
      'ventas/abonos': ['view', 'create', 'pdf'],
      'ventas/domicilios': ['view'],
      'compras/proveedores': ['view'],
      'compras/compras': ['view'],
      'compras/productos': ['view'],
      'compras/categorias': ['view']
    }
  },
  Productor: {
    modules: ['dashboard', 'produccion/insumos', 'produccion/produccion', 'compras/productos', 'compras/compras'],
    actions: {
      'produccion/insumos': ['view', 'create', 'edit'],
      'produccion/produccion': ['view', 'create', 'edit', 'pdf'],
      'compras/productos': ['view'],
      'compras/compras': ['view']
    }
  },
  Repartidor: {
    modules: ['dashboard', 'ventas/domicilios', 'ventas/pedidos'],
    actions: {
      'ventas/domicilios': ['view', 'edit'],
      'ventas/pedidos': ['view']
    }
  },
  Cliente: {
    modules: ['cliente/tienda', 'cliente/pedidos', 'cliente/perfil'],
    actions: {
      'cliente/tienda': ['view'],
      'cliente/pedidos': ['view', 'create'],
      'cliente/perfil': ['view', 'edit']
    }
  }
};

const normalizePermissions = (permissions: unknown): string[] => {
  if (typeof permissions === 'string') {
    try {
      const parsed = JSON.parse(permissions);
      return normalizePermissions(parsed);
    } catch {
      return permissions
        .split(',')
        .map((permission) => permission.trim())
        .filter(Boolean);
    }
  }

  if (!Array.isArray(permissions)) return [];

  return permissions
    .filter((permission): permission is string => typeof permission === 'string')
    .map((permission) => permission.trim())
    .filter(Boolean);
};

const permissionAccessMap: Record<string, { modules: string[]; actions: Record<string, string[]> }> = {
  'Ver Dashboard': { modules: ['dashboard'], actions: { dashboard: ['view'] } },
  'Ver Usuarios': { modules: ['usuarios'], actions: { usuarios: ['view'] } },
  'Crear Usuarios': { modules: ['usuarios'], actions: { usuarios: ['create'] } },
  'Editar Usuarios': { modules: ['usuarios'], actions: { usuarios: ['edit'] } },
  'Eliminar Usuarios': { modules: ['usuarios'], actions: { usuarios: ['delete'] } },
  'Ver Roles': { modules: ['configuracion'], actions: { configuracion: ['view'] } },
  'Asignar Permisos': { modules: ['configuracion'], actions: { configuracion: ['edit'] } },
  'Ver Proveedores': { modules: ['compras/proveedores'], actions: { 'compras/proveedores': ['view'] } },
  'Crear Proveedores': { modules: ['compras/proveedores'], actions: { 'compras/proveedores': ['create'] } },
  'Editar Proveedores': { modules: ['compras/proveedores'], actions: { 'compras/proveedores': ['edit'] } },
  'Ver Compras': { modules: ['compras/compras'], actions: { 'compras/compras': ['view'] } },
  'Registrar Compras': { modules: ['compras/compras'], actions: { 'compras/compras': ['create'] } },
  'Anular Compras': { modules: ['compras/compras'], actions: { 'compras/compras': ['cancel'] } },
  'Ver Productos': { modules: ['compras/productos'], actions: { 'compras/productos': ['view'] } },
  'Crear Productos': { modules: ['compras/productos'], actions: { 'compras/productos': ['create'] } },
  'Editar Productos': { modules: ['compras/productos'], actions: { 'compras/productos': ['edit'] } },
  'Ver Categorías': { modules: ['compras/categorias'], actions: { 'compras/categorias': ['view'] } },
  'Crear Categorías': { modules: ['compras/categorias'], actions: { 'compras/categorias': ['create'] } },
  'Ver Insumos': { modules: ['produccion/insumos'], actions: { 'produccion/insumos': ['view'] } },
  'Entregar Insumos': { modules: ['produccion/insumos'], actions: { 'produccion/insumos': ['edit'] } },
  'Ver Producción': { modules: ['produccion/produccion'], actions: { 'produccion/produccion': ['view'] } },
  'Registrar Producción': { modules: ['produccion/produccion'], actions: { 'produccion/produccion': ['create'] } },
  'Ver Clientes': { modules: ['ventas/clientes'], actions: { 'ventas/clientes': ['view'] } },
  'Crear Clientes': { modules: ['ventas/clientes'], actions: { 'ventas/clientes': ['create'] } },
  'Editar Clientes': { modules: ['ventas/clientes'], actions: { 'ventas/clientes': ['edit'] } },
  'Ver Ventas': { modules: ['ventas/ventas'], actions: { 'ventas/ventas': ['view'] } },
  'Registrar Ventas': { modules: ['ventas/ventas'], actions: { 'ventas/ventas': ['create'] } },
  'Anular Ventas': { modules: ['ventas/ventas'], actions: { 'ventas/ventas': ['cancel'] } },
  'Ver Abonos': { modules: ['ventas/abonos'], actions: { 'ventas/abonos': ['view'] } },
  'Registrar Abonos': { modules: ['ventas/abonos'], actions: { 'ventas/abonos': ['create'] } },
  'Ver Pedidos': { modules: ['ventas/pedidos'], actions: { 'ventas/pedidos': ['view'] } },
  'Crear Pedidos': { modules: ['ventas/pedidos'], actions: { 'ventas/pedidos': ['create'] } },
  'Ver Domicilios': { modules: ['ventas/domicilios'], actions: { 'ventas/domicilios': ['view'] } },
  'Gestionar Domicilios': { modules: ['ventas/domicilios'], actions: { 'ventas/domicilios': ['edit'] } },
  'Ver Tienda': { modules: ['cliente/tienda'], actions: { 'cliente/tienda': ['view'] } },
  'Ver Mis Pedidos': { modules: ['cliente/pedidos'], actions: { 'cliente/pedidos': ['view'] } },
  'Ver Mi Perfil': { modules: ['cliente/perfil'], actions: { 'cliente/perfil': ['view'] } },
};

const permissionsToAccessMap = (permissions: string[]) => {
  const modules = new Set<string>();
  const actions: Record<string, string[]> = {};

  permissions.forEach((permission) => {
    const access = permissionAccessMap[permission];
    if (!access) return;

    access.modules.forEach((moduleName) => {
      modules.add(moduleName);
    });

    Object.entries(access.actions).forEach(([moduleName, moduleActions]) => {
      if (!actions[moduleName]) {
        actions[moduleName] = [];
      }

      moduleActions.forEach((actionName) => {
        if (!actions[moduleName].includes(actionName)) {
          actions[moduleName].push(actionName);
        }
      });
    });
  });

  return { modules: Array.from(modules), actions };
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
      permisos: normalizePermissions(result.permisos),
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

  const login = async (email: string, password: string, rememberMe = false): Promise<AuthLoginResult> => {
    try {
      const result = await auth.login(email, password, rememberMe);
      const mappedUser = mapUser(result);
      if (mappedUser) {
        setUser(mappedUser);
        setSessionExpiresAtMs(resolveSessionExpiresAt(result));
        return {
          success: true,
          message: 'Inicio de sesión exitoso',
        };
      }
      return {
        success: false,
        message: 'No se pudo iniciar sesión con las credenciales proporcionadas',
      };
    } catch (error) {
      console.error('Error de login:', error);
      return {
        success: false,
        message:
          typeof (error as any)?.message === 'string' && (error as any).message.trim()
            ? (error as any).message
            : 'No se pudo iniciar sesión. Intenta nuevamente.',
        status: Number.isFinite(Number((error as any)?.status)) ? Number((error as any).status) : undefined,
      };
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

    const permissions = user.permisos?.length
      ? permissionsToAccessMap(user.permisos)
      : rolePermissions[user.rol];
    
    // Administrador tiene acceso total
    if (user.rol === 'Administrador') return true;

    const normalizedModule = module.replace(/^\/+/, '');
    if (!normalizedModule) return true;

    if (!permissions.modules.includes(normalizedModule)) return false;

    const moduleActions = permissions.actions[normalizedModule] || [];
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