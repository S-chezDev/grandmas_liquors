import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthProvider, useAuth } from './components/AuthContext';
import { useAlertDialog } from './components/AlertDialog';
import { subscribeApiLoading } from './services/api';

// Login
import { Login } from './components/pages/Login';

// Dashboard
import { Dashboard } from './components/pages/Dashboard';

// Usuarios
import { Roles } from './components/pages/usuarios/Roles';
import { Usuarios } from './components/pages/usuarios/Usuarios';
import { Accesos } from './components/pages/usuarios/Accesos';

// Compras
import { Proveedores } from './components/pages/compras/Proveedores';
import { Compras } from './components/pages/compras/Compras';
import { Productos } from './components/pages/compras/Productos';
import { Categorias } from './components/pages/compras/Categorias';

// Producción
import { Insumos } from './components/pages/produccion/Insumos';
import { Produccion } from './components/pages/produccion/Produccion';

// Ventas
import { Clientes } from './components/pages/ventas/Clientes';
import { Ventas } from './components/pages/ventas/Ventas';
import { Abonos } from './components/pages/ventas/Abonos';
import { Pedidos } from './components/pages/ventas/Pedidos';
import { Domicilios } from './components/pages/ventas/Domicilios';

// Cliente
import { TiendaCliente } from './components/pages/cliente/TiendaCliente';
import { MisPedidos } from './components/pages/cliente/MisPedidos';
import { MiPerfil } from './components/pages/cliente/MiPerfil';

const pageComponents: { [key: string]: React.ComponentType } = {
  '/': Dashboard,
  '/dashboard': Dashboard,
  '/medicion': Dashboard,
  '/usuarios/roles': Roles,
  '/usuarios/usuarios': Usuarios,
  '/usuarios/accesos': Accesos,
  '/compras/proveedores': Proveedores,
  '/compras/compras': Compras,
  '/compras/productos': Productos,
  '/compras/categorias': Categorias,
  '/produccion/insumos': Insumos,
  '/produccion/produccion': Produccion,
  '/ventas/clientes': Clientes,
  '/ventas/ventas': Ventas,
  '/ventas/abonos': Abonos,
  '/ventas/pedidos': Pedidos,
  '/ventas/domicilios': Domicilios,
  '/configuracion/roles': Roles,
  '/cliente/tienda': TiendaCliente,
  '/cliente/pedidos': MisPedidos,
  '/cliente/perfil': MiPerfil
};

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/medicion': 'Dashboard',
  '/usuarios/roles': 'Gestión de Roles',
  '/usuarios/usuarios': 'Gestión de Usuarios',
  '/usuarios/accesos': 'Gestión de Accesos',
  '/compras/proveedores': 'Proveedores',
  '/compras/compras': 'Compras',
  '/compras/productos': 'Productos',
  '/compras/categorias': 'Categorías de Producto',
  '/produccion/insumos': 'Entrega de Insumos',
  '/produccion/produccion': 'Producción',
  '/ventas/clientes': 'Clientes',
  '/ventas/ventas': 'Ventas',
  '/ventas/abonos': 'Abonos',
  '/ventas/pedidos': 'Pedidos',
  '/ventas/domicilios': 'Domicilios',
  '/configuracion/roles': 'Gestión de Roles',
  '/cliente/tienda': 'Tienda de Productos',
  '/cliente/pedidos': 'Mis Pedidos',
  '/cliente/perfil': 'Mi Perfil'
};

function GlobalLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A0A14]/25 backdrop-blur-[1.5px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center justify-center rounded-2xl border border-[#7A1F3D]/25 bg-white/95 p-6 shadow-2xl">
        <div className="relative h-14 w-14" style={{ willChange: 'transform' }}>
          <div className="absolute inset-0 rounded-full border border-[#7A1F3D]/20" />
          <div className="absolute inset-[1px] rounded-full border-[3px] border-[#7A1F3D]/18 border-t-[#7A1F3D] animate-spin motion-reduce:animate-none" />
          <div
            className="absolute inset-0 rounded-full animate-spin motion-reduce:animate-none"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(122,31,61,0.08) 0deg, rgba(122,31,61,0.25) 200deg, rgba(122,31,61,0.95) 325deg, rgba(122,31,61,0.08) 360deg)',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))',
            }}
          />
          <div
            className="absolute inset-[4px] rounded-full motion-reduce:[animation:none]"
            style={{
              animation: 'spin 1.8s linear infinite reverse',
              background:
                'conic-gradient(from 0deg, rgba(122,31,61,0.06) 0deg, rgba(122,31,61,0.18) 190deg, rgba(122,31,61,0.62) 312deg, rgba(122,31,61,0.06) 360deg)',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))',
            }}
          />
          <div className="absolute inset-[19px] rounded-full bg-[#7A1F3D]/12" />
        </div>
        <span className="sr-only">Cargando, por favor espera</span>
      </div>
    </div>
  );
}

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isGlobalLoadingVisible, setIsGlobalLoadingVisible] = useState(false);
  const showTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAtRef = React.useRef<number | null>(null);
  const { user, login, logout, hasPermission } = useAuth();
  const { showAlert, AlertComponent } = useAlertDialog();

  // Asegura landing consistente al iniciar sesion/cambiar de rol.
  React.useEffect(() => {
    if (!user) {
      setCurrentPath('');
      return;
    }

    const defaultPath = user.rol === 'Cliente' ? '/cliente/tienda' : '/dashboard';
    setCurrentPath(defaultPath);
  }, [user?.id, user?.rol]);

  React.useEffect(() => {
    const unsubscribe = subscribeApiLoading((loading) => {
      setIsApiLoading(loading);
    });

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    const showDelayMs = 60;
    const minVisibleMs = 300;

    const clearShowTimer = () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
    };

    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    if (isApiLoading) {
      clearHideTimer();

      if (!isGlobalLoadingVisible && !showTimerRef.current) {
        showTimerRef.current = setTimeout(() => {
          shownAtRef.current = Date.now();
          setIsGlobalLoadingVisible(true);
          showTimerRef.current = null;
        }, showDelayMs);
      }
    } else {
      clearShowTimer();

      if (isGlobalLoadingVisible) {
        const shownAt = shownAtRef.current ?? Date.now();
        const elapsed = Date.now() - shownAt;
        const remaining = Math.max(0, minVisibleMs - elapsed);

        clearHideTimer();
        hideTimerRef.current = setTimeout(() => {
          setIsGlobalLoadingVisible(false);
          shownAtRef.current = null;
          hideTimerRef.current = null;
        }, remaining);
      }
    }

    return () => {
      clearShowTimer();
      clearHideTimer();
    };
  }, [isApiLoading, isGlobalLoadingVisible]);

  const handleNavigate = (path: string) => {
    // Verificar si el usuario tiene permiso para acceder a esta ruta
    if (hasPermission(path.substring(1))) { // Quitar el '/' inicial
      setCurrentPath(path);
    } else {
      showAlert({
        title: 'Acceso denegado',
        description: 'No tienes permisos para acceder a esta sección.',
        type: 'warning',
        onConfirm: () => {},
        confirmText: 'Entendido',
        cancelText: 'Cerrar',
      });
    }
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password);
    if (success) {
      console.log('Login exitoso');
      return true;
    }
    return false;
  };

  // Si no está autenticado, mostrar pantalla de login
  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        {AlertComponent}
        {isGlobalLoadingVisible && <GlobalLoadingOverlay />}
      </>
    );
  }

  const CurrentPage = pageComponents[currentPath] || (user.rol === 'Cliente' ? TiendaCliente : Dashboard);
  const pageTitle = pageTitles[currentPath] || 'Grandma\'s Liqueurs';

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} userName={`${user.nombre} ${user.apellido}`} userRole={user.rol} onLogout={logout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <CurrentPage />
        </main>
      </div>
      {AlertComponent}

      {isGlobalLoadingVisible && <GlobalLoadingOverlay />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}