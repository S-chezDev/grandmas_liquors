import React from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { useAuth } from '../AuthContext';
import { ArrowRight, BarChart3, Boxes, ShieldCheck, ShoppingCart, Sparkles, Truck, ClipboardList, CreditCard, Cpu, Warehouse, Users } from 'lucide-react';

export function Home() {
  const { user } = useAuth();
  const summaryCards = [
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      title: 'Ventas y pedidos',
      description: 'Control comercial con trazabilidad de clientes, ventas, pedidos y abonos.',
    },
    {
      icon: <Warehouse className="w-5 h-5" />,
      title: 'Compras e inventario',
      description: 'Seguimiento de productos, proveedores, categorías y compras en un solo flujo.',
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: 'Producción',
      description: 'Administración de insumos, órdenes de producción y entregas operativas.',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Accesos y roles',
      description: 'Permisos por rol, control de usuarios y restricciones por módulo.',
    },
  ];

  const capabilityRows = [
    { label: 'Pedidos y domicilios', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Cobros y abonos', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Trazabilidad operativa', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Inventario y compras', icon: <Boxes className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,#1a0d12_0%,#2a1119_45%,#0f172a_100%)] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Plataforma integral de gestión
            </div>

            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl leading-tight text-white">
                {user ? `Bienvenido, ${user.nombre}` : 'Grandma\'s Liqueurs'}
              </h1>
              <p className="text-base sm:text-lg text-white/78 max-w-2xl">
                Centraliza la operación comercial y administrativa en un solo lugar. La plataforma permite gestionar ventas,
                pedidos, compras, producción, domicilios, usuarios y permisos con trazabilidad y control por rol.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button>
                Ir al Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/80">
                Rol actual: {user?.rol || 'Usuario'}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {capabilityRows.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-white">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Qué resuelve</p>
                <h2 className="mt-2 text-2xl">Operación ordenada, acceso controlado</h2>
              </div>

              <div className="space-y-3">
                {summaryCards.map((card) => (
                  <div key={card.title} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary">{card.icon}</div>
                      <div>
                        <h3>{card.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="space-y-3">
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary w-fit">
              Flujo comercial
            </div>
            <h3>Ventas, pedidos y abonos</h3>
            <p className="text-sm text-muted-foreground">
              Administra el ciclo comercial desde el primer pedido hasta el seguimiento del pago y la entrega.
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 w-fit">
              Control operativo
            </div>
            <h3>Compras, inventario y producción</h3>
            <p className="text-sm text-muted-foreground">
              Conecta insumos, compras, producción y entregas para mantener la operación sincronizada.
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 w-fit">
              Seguridad
            </div>
            <h3>Permisos por rol</h3>
            <p className="text-sm text-muted-foreground">
              Cada usuario solo ve los módulos que le fueron asignados por el administrador.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}