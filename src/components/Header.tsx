import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';


interface HeaderProps {
  title: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export function Header({ title, userName = 'Usuario', userRole = 'Rol', onLogout }: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  // Cerrar dropdown de notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  return (
    <>
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 hover:bg-accent rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </button>

              {/* Dropdown de Notificaciones */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-border bg-accent/50">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notificaciones
                    </h3>
                  </div>
                  <div className="p-8 text-center min-h-[120px] flex flex-col items-center justify-center">
                    <div className="p-4 bg-accent/30 rounded-full mb-3">
                      <Bell className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">No tienes notificaciones</p>
                    <p className="text-muted-foreground/70 text-xs mt-1">Cuando recibas notificaciones aparecerán aquí</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
