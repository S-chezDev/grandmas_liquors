import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Users, 
  ShoppingCart, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Shield,
  LogIn,
  Building2,
  Boxes,
  Tags,
  Truck,
  Factory,
  UserCircle,
  Receipt,
  CreditCard,
  ClipboardList,
  Home,
  Settings,
  Store,
  User,
  KeyRound
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { Modal } from './Modal';
import { AlertDialog } from './AlertDialog';

interface SubMenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  module: string;
}

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path?: string;
  module?: string;
  subItems?: SubMenuItem[];
  roles?: string[];  // Roles que pueden ver este item
}

const menuItems: MenuItem[] = [
  {
    name: 'Inicio',
    icon: <Home className="w-5 h-5" />,
    path: '/',
    module: 'dashboard',
    roles: ['Administrador', 'Asesor', 'Productor', 'Repartidor']
  },
  {
    name: 'Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    path: '/dashboard',
    module: 'dashboard',
    roles: ['Administrador', 'Asesor', 'Productor', 'Repartidor']
  },
  {
    name: 'Usuarios',
    icon: <Users className="w-5 h-5" />,
    module: 'usuarios',
    roles: ['Administrador'],
    subItems: [
      { name: 'Gestión de Usuarios', icon: <Users className="w-4 h-4" />, path: '/usuarios/usuarios', module: 'usuarios' }
    ]
  },
  {
    name: 'Compras',
    icon: <ShoppingCart className="w-5 h-5" />,
    module: 'compras',
    roles: ['Administrador', 'Asesor', 'Productor'],
    subItems: [
      { name: 'Proveedores', icon: <Building2 className="w-4 h-4" />, path: '/compras/proveedores', module: 'compras' },
      { name: 'Compras', icon: <ShoppingCart className="w-4 h-4" />, path: '/compras/compras', module: 'compras' },
      { name: 'Productos', icon: <Package className="w-4 h-4" />, path: '/compras/productos', module: 'compras/productos' },
      { name: 'Categorías de Producto', icon: <Tags className="w-4 h-4" />, path: '/compras/categorias', module: 'compras' }
    ]
  },
  {
    name: 'Producción',
    icon: <Factory className="w-5 h-5" />,
    module: 'produccion',
    roles: ['Administrador', 'Productor'],
    subItems: [
      { name: 'Entrega de Insumos', icon: <Truck className="w-4 h-4" />, path: '/produccion/insumos', module: 'produccion' },
      { name: 'Producción', icon: <Boxes className="w-4 h-4" />, path: '/produccion/produccion', module: 'produccion' }
    ]
  },
  {
    name: 'Ventas',
    icon: <ShoppingBag className="w-5 h-5" />,
    module: 'ventas',
    roles: ['Administrador', 'Asesor', 'Repartidor'],
    subItems: [
      { name: 'Clientes', icon: <UserCircle className="w-4 h-4" />, path: '/ventas/clientes', module: 'ventas' },
      { name: 'Ventas', icon: <Receipt className="w-4 h-4" />, path: '/ventas/ventas', module: 'ventas' },
      { name: 'Abonos', icon: <CreditCard className="w-4 h-4" />, path: '/ventas/abonos', module: 'ventas' },
      { name: 'Pedidos', icon: <ClipboardList className="w-4 h-4" />, path: '/ventas/pedidos', module: 'ventas/pedidos' },
      { name: 'Domicilios', icon: <Truck className="w-4 h-4" />, path: '/ventas/domicilios', module: 'ventas/domicilios' }
    ]
  },
  // Menú exclusivo para Cliente
  {
    name: 'Tienda',
    icon: <Store className="w-5 h-5" />,
    path: '/cliente/tienda',
    module: 'cliente',
    roles: ['Cliente']
  },
  {
    name: 'Mis Pedidos',
    icon: <ClipboardList className="w-5 h-5" />,
    path: '/cliente/pedidos',
    module: 'cliente',
    roles: ['Cliente']
  },
  {
    name: 'Mi Perfil',
    icon: <User className="w-5 h-5" />,
    path: '/cliente/perfil',
    module: 'cliente',
    roles: ['Cliente']
  }
];

// Item de configuración que aparecerá en la parte inferior (solo para Administrador)
const configurationItem: MenuItem = {
  name: 'Configuración',
  icon: <Settings className="w-5 h-5" />,
  module: 'configuracion',
  roles: ['Administrador'],
  subItems: [
    { name: 'Gestión de Roles', icon: <Shield className="w-4 h-4" />, path: '/configuracion/roles', module: 'configuracion' }
  ]
};

// Item de configuración simple para otros roles
const simpleConfigurationItem: MenuItem = {
  name: 'Configuración',
  icon: <Settings className="w-5 h-5" />,
  module: 'settings',
  roles: ['Asesor', 'Productor', 'Repartidor', 'Cliente']
};

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Usuarios', 'Compras', 'Ventas', 'Configuración']);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isConfigDropdownOpen, setIsConfigDropdownOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const configDropdownRef = useRef<HTMLDivElement>(null);
  const { hasPermission, user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'info' as 'warning' | 'info' | 'success' | 'danger',
    onConfirm: () => {}
  });

  const toggleItem = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Cerrar dropdown de configuración al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (configDropdownRef.current && !configDropdownRef.current.contains(event.target as Node)) {
        setIsConfigDropdownOpen(false);
      }
    };

    if (isConfigDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isConfigDropdownOpen]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'Las contraseñas nuevas no coinciden',
        type: 'danger',
        onConfirm: () => {}
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setAlertState({
        isOpen: true,
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres',
        type: 'danger',
        onConfirm: () => {}
      });
      return;
    }
    
    // Aquí iría la lógica para cambiar la contraseña
    setAlertState({
      isOpen: true,
      title: 'Contraseña actualizada',
      description: 'Tu contraseña ha sido actualizada exitosamente',
      type: 'success',
      onConfirm: () => {
        setIsChangePasswordOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    });
  };

  // Filtrar los items del menú según los permisos del usuario y rol
  const filteredMenuItems = menuItems.filter(item => {
    // Si el item especifica roles, verificar que el usuario tenga uno de ellos
    if (item.roles && user && !item.roles.includes(user.rol)) {
      return false;
    }
    
    if (item.module && !hasPermission(item.module)) {
      return false;
    }
    if (item.subItems) {
      // Filtrar sub-items según permisos
      item.subItems = item.subItems.filter(subItem => hasPermission(subItem.module));
      return item.subItems.length > 0;
    }
    return true;
  });

  return (
    <div 
      className={`bg-sidebar text-sidebar-foreground h-screen flex flex-col border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="mb-2">
            <h2 className="text-sidebar-foreground">Grandma's Liqueurs</h2>
            <p className="text-sm text-sidebar-foreground/70">Sistema de Gestión</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <ChevronRight className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-2">
        {filteredMenuItems.map((item) => (
          <div key={item.name} className="mb-1">
            {item.subItems ? (
              <>
                <button
                  onClick={() => toggleItem(item.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors group"
                  title={isCollapsed ? item.name : ''}
                >
                  <span className="text-sidebar-foreground">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sidebar-foreground">{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform text-sidebar-foreground ${
                          expandedItems.includes(item.name) ? 'rotate-180' : ''
                        }`}
                      />
                    </>
                  )}
                </button>
                {expandedItems.includes(item.name) && !isCollapsed && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.path}
                        onClick={() => onNavigate(subItem.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          currentPath === subItem.path
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'hover:bg-sidebar-accent text-sidebar-foreground'
                        }`}
                      >
                        {subItem.icon}
                        <span>{subItem.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => item.path && onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPath === item.path
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <span>{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Configuration at bottom - Para Administrador con submenú */}
      {user && user.rol === 'Administrador' && configurationItem.roles?.includes(user.rol) && hasPermission(configurationItem.module!) && (
        <div className="p-2 border-t border-sidebar-border">
          <div className="mb-1">
            <button
              onClick={() => toggleItem(configurationItem.name)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors group"
              title={isCollapsed ? configurationItem.name : ''}
            >
              <span className="text-sidebar-foreground">{configurationItem.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left text-sidebar-foreground">{configurationItem.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform text-sidebar-foreground ${
                      expandedItems.includes(configurationItem.name) ? 'rotate-180' : ''
                    }`}
                  />
                </>
              )}
            </button>
            {expandedItems.includes(configurationItem.name) && !isCollapsed && configurationItem.subItems && (
              <div className="ml-4 mt-1 space-y-1">
                {configurationItem.subItems.map((subItem) => (
                  <button
                    key={subItem.path}
                    onClick={() => onNavigate(subItem.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      currentPath === subItem.path
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'hover:bg-sidebar-accent text-sidebar-foreground'
                    }`}
                  >
                    {subItem.icon}
                    <span>{subItem.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Configuration at bottom - Para otros roles (simple) */}
      {user && user.rol !== 'Administrador' && simpleConfigurationItem.roles?.includes(user.rol) && (
        <div className="p-2 border-t border-sidebar-border">
          <div className="mb-1" ref={configDropdownRef}>
            <div className="relative">
              <button
                onClick={() => setIsConfigDropdownOpen(!isConfigDropdownOpen)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors group"
                title={isCollapsed ? simpleConfigurationItem.name : ''}
              >
                <span className="text-sidebar-foreground">{simpleConfigurationItem.icon}</span>
                {!isCollapsed && (
                  <span className="flex-1 text-left text-sidebar-foreground">{simpleConfigurationItem.name}</span>
                )}
              </button>

              {/* Dropdown de Configuración */}
              {isConfigDropdownOpen && !isCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-sidebar border border-sidebar-border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsConfigDropdownOpen(false);
                        setIsChangePasswordOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors text-left"
                    >
                      <KeyRound className="w-4 h-4 text-sidebar-foreground" />
                      <span className="text-sm text-sidebar-foreground">Restablecer contraseña</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="text-xs text-sidebar-foreground/70">
            <p>Calle 104 # 79D – 65</p>
            <p>Medellín, Laureles</p>
            <p className="mt-1">Tel: 324 610 2339</p>
          </div>
        )}
      </div>

      {/* Modal de Cambio de Contraseña */}
      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Restablecer contraseña"
        size="sm"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
              Contraseña actual
            </label>
            <input
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Actualizar contraseña
            </button>
          </div>
        </form>
      </Modal>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          alertState.onConfirm();
          setAlertState(prev => ({ ...prev, isOpen: false }));
        }}
        title={alertState.title}
        description={alertState.description}
        type={alertState.type}
      />
    </div>
  );
}