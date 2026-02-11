import React, { useState } from 'react';
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
  User
} from 'lucide-react';
import { useAuth } from './AuthContext';

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
    name: 'Configuración',
    icon: <Settings className="w-5 h-5" />,
    module: 'configuracion',
    roles: ['Administrador'],
    subItems: [
      { name: 'Gestión de Roles', icon: <Shield className="w-4 h-4" />, path: '/configuracion/roles', module: 'configuracion' }
    ]
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

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Usuarios', 'Compras', 'Ventas', 'Configuración']);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { hasPermission, user } = useAuth();

  const toggleItem = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
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
    </div>
  );
}