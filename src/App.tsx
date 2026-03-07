import React, { Suspense, lazy, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthProvider, useAuth } from './components/AuthContext';
import { useAlertDialog } from './components/AlertDialog';
import { subscribeApiLoading } from './services/api';

// Login
import { Login } from './components/pages/Login';

const DashboardPage = lazy(() => import('./components/pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const RolesPage = lazy(() => import('./components/pages/usuarios/Roles').then((module) => ({ default: module.Roles })));
const UsuariosPage = lazy(() => import('./components/pages/usuarios/Usuarios').then((module) => ({ default: module.Usuarios })));
const AccesosPage = lazy(() => import('./components/pages/usuarios/Accesos').then((module) => ({ default: module.Accesos })));
const ProveedoresPage = lazy(() => import('./components/pages/compras/Proveedores').then((module) => ({ default: module.Proveedores })));
const ComprasPage = lazy(() => import('./components/pages/compras/Compras').then((module) => ({ default: module.Compras })));
const ProductosPage = lazy(() => import('./components/pages/compras/Productos').then((module) => ({ default: module.Productos })));
const CategoriasPage = lazy(() => import('./components/pages/compras/Categorias').then((module) => ({ default: module.Categorias })));
const InsumosPage = lazy(() => import('./components/pages/produccion/Insumos').then((module) => ({ default: module.Insumos })));
const ProduccionPage = lazy(() => import('./components/pages/produccion/Produccion').then((module) => ({ default: module.Produccion })));
const ClientesPage = lazy(() => import('./components/pages/ventas/Clientes').then((module) => ({ default: module.Clientes })));
const VentasPage = lazy(() => import('./components/pages/ventas/Ventas').then((module) => ({ default: module.Ventas })));
const AbonosPage = lazy(() => import('./components/pages/ventas/Abonos').then((module) => ({ default: module.Abonos })));
const PedidosPage = lazy(() => import('./components/pages/ventas/Pedidos').then((module) => ({ default: module.Pedidos })));
const DomiciliosPage = lazy(() => import('./components/pages/ventas/Domicilios').then((module) => ({ default: module.Domicilios })));
const TiendaClientePage = lazy(() => import('./components/pages/cliente/TiendaCliente').then((module) => ({ default: module.TiendaCliente })));
const MisPedidosPage = lazy(() => import('./components/pages/cliente/MisPedidos').then((module) => ({ default: module.MisPedidos })));
const MiPerfilPage = lazy(() => import('./components/pages/cliente/MiPerfil').then((module) => ({ default: module.MiPerfil })));

const pageComponents: { [key: string]: React.ComponentType } = {
  '/': DashboardPage,
  '/dashboard': DashboardPage,
  '/medicion': DashboardPage,
  '/usuarios/roles': RolesPage,
  '/usuarios/usuarios': UsuariosPage,
  '/usuarios/accesos': AccesosPage,
  '/compras/proveedores': ProveedoresPage,
  '/compras/compras': ComprasPage,
  '/compras/productos': ProductosPage,
  '/compras/categorias': CategoriasPage,
  '/produccion/insumos': InsumosPage,
  '/produccion/produccion': ProduccionPage,
  '/ventas/clientes': ClientesPage,
  '/ventas/ventas': VentasPage,
  '/ventas/abonos': AbonosPage,
  '/ventas/pedidos': PedidosPage,
  '/ventas/domicilios': DomiciliosPage,
  '/configuracion/roles': RolesPage,
  '/cliente/tienda': TiendaClientePage,
  '/cliente/pedidos': MisPedidosPage,
  '/cliente/perfil': MiPerfilPage
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

function PageLoadingFallback() {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <p className="text-sm text-muted-foreground">Cargando modulo...</p>
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
  const { user, isAuthLoading, sessionWarningVersion, login, logout, hasPermission } = useAuth();
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
    if (!user || sessionWarningVersion === 0) return;

    showAlert({
      title: 'Tu sesion cerrara pronto',
      description: 'Por seguridad, tu sesion expirara en aproximadamente 30 segundos. Guarda cualquier cambio pendiente.',
      type: 'info',
      onConfirm: () => {},
      confirmText: 'Entendido',
      cancelText: 'Cerrar',
    });
  }, [sessionWarningVersion, user?.id, showAlert]);

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

  if (isAuthLoading) {
    return (
      <>
        {AlertComponent}
        <GlobalLoadingOverlay />
      </>
    );
  }

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

  const CurrentPage = pageComponents[currentPath] || (user.rol === 'Cliente' ? TiendaClientePage : DashboardPage);
  const pageTitle = pageTitles[currentPath] || 'Grandma\'s Liqueurs';

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} userName={`${user.nombre} ${user.apellido}`} userRole={user.rol} onLogout={logout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<PageLoadingFallback />}>
            <CurrentPage />
          </Suspense>
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