import React from 'react';
import {
  Wine,
  GlassWater,
  Beer,
  Sparkles,
  Truck,
  ShieldCheck,
  Clock4,
  Award,
  Phone,
  MapPin,
  Mail,
  ArrowRight,
} from 'lucide-react';

interface PublicHomeProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

interface CategoriaCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

const CategoriaCard: React.FC<CategoriaCardProps> = ({ icon, title, description, accent }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white/95 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(122,31,61,0.18)]">
    <div
      className="absolute inset-x-0 -top-12 h-24 opacity-70 blur-2xl"
      style={{ background: accent }}
      aria-hidden="true"
    />
    <div className="relative flex items-center gap-4">
      <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/15">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
    <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    <div className="relative mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary opacity-80 transition group-hover:opacity-100">
      Explorar selección
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </div>
  </div>
);

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white/80 p-4 backdrop-blur-sm">
    <div className="rounded-xl bg-primary/10 p-2.5 text-primary ring-1 ring-primary/10">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

export function PublicHome({ onOpenLogin, onOpenRegister }: PublicHomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7F8] via-background to-[#FFF1F4] text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/favicon/android-chrome-192x192.png"
              alt="Grandma's Liqueurs"
              className="h-10 w-10 rounded-xl object-cover ring-1 ring-primary/20"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-primary">Grandma's Liqueurs</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Licorera virtual</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
            <a href="#categorias" className="transition-colors hover:text-primary">Catálogo</a>
            <a href="#beneficios" className="transition-colors hover:text-primary">Por qué nosotros</a>
            <a href="#contacto" className="transition-colors hover:text-primary">Contacto</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-full border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary/5"
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={onOpenRegister}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_8px_22px_rgba(128,0,32,0.25)] transition-all hover:shadow-[0_12px_32px_rgba(128,0,32,0.35)]"
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              'radial-gradient(60% 50% at 80% 0%, rgba(128,0,32,0.18) 0%, rgba(128,0,32,0) 60%), radial-gradient(40% 40% at 0% 80%, rgba(212,24,61,0.10) 0%, rgba(212,24,61,0) 60%)',
          }}
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/80 px-3 py-1 text-xs font-medium text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Distribuidora artesanal · Medellín y área metropolitana
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-foreground animate-fade-in-up sm:text-5xl lg:text-[3.6rem]">
              Sabores con alma,
              <span className="block bg-gradient-to-r from-primary to-[#B4324E] bg-clip-text text-transparent">
                entregados a tu puerta.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              En Grandma's Liqueurs combinamos selección artesanal y un sistema profesional para que
              escojas, ordenes y recibas tus licores favoritos con la confianza de una experiencia premium.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={onOpenRegister}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_rgba(128,0,32,0.28)] transition-transform hover:-translate-y-0.5"
              >
                Crear mi cuenta
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5"
              >
                Ya tengo cuenta
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              <Feature
                icon={<Truck className="h-5 w-5" />}
                title="Domicilios Express"
                description="Cobertura en Medellín y municipios cercanos."
              />
              <Feature
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Compra segura"
                description="Plataforma con autenticación y datos cifrados."
              />
              <Feature
                icon={<Clock4 className="h-5 w-5" />}
                title="Atención 24/7"
                description="Asesoría y pedidos a cualquier hora."
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-primary/15 via-transparent to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.18)] ring-1 ring-black/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Selección Premium
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">Tu cava, en línea</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary ring-1 ring-primary/15">
                  <Award className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { name: 'Whisky', icon: <GlassWater className="h-5 w-5" />, accent: '#FFE9E1' },
                  { name: 'Vinos', icon: <Wine className="h-5 w-5" />, accent: '#F8DDE5' },
                  { name: 'Cervezas', icon: <Beer className="h-5 w-5" />, accent: '#FFF0CC' },
                  { name: 'Premium', icon: <Sparkles className="h-5 w-5" />, accent: '#EDE2FF' },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white/80 p-3 shadow-sm"
                  >
                    <div
                      className="rounded-xl p-2 text-primary"
                      style={{ background: item.accent }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Catálogo curado</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#7A1F3D] to-[#B4324E] p-4 text-white shadow-inner">
                <p className="text-xs uppercase tracking-[0.2em] text-white/75">Pedido del momento</p>
                <p className="mt-1 text-base font-semibold">Whisky Single Malt 12 años</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-white/80">Disponible para envío hoy</p>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
                    En stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section id="categorias" className="border-t border-border/60 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Catálogo
            </span>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Una selección curada para cada ocasión
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Desde clásicos imperdibles hasta destilados artesanales y maridajes premium. Encuentra
              tu favorito y pídelo con un clic.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <CategoriaCard
              icon={<GlassWater className="h-6 w-6" />}
              title="Licores"
              description="Whisky, ron, vodka, ginebra y destilados premium para coleccionistas y conocedores."
              accent="rgba(128,0,32,0.20)"
            />
            <CategoriaCard
              icon={<Wine className="h-6 w-6" />}
              title="Vinos"
              description="Tintos, blancos y rosados de las mejores bodegas, ideales para cada maridaje."
              accent="rgba(180,50,78,0.18)"
            />
            <CategoriaCard
              icon={<Beer className="h-6 w-6" />}
              title="Cervezas"
              description="Cervezas artesanales, importadas y tradicionales, frías y listas para entrega."
              accent="rgba(212,24,61,0.18)"
            />
            <CategoriaCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Brindis & Regalos"
              description="Cajas premium, botellas conmemorativas y arreglos pensados para sorprender."
              accent="rgba(128,0,32,0.18)"
            />
            <CategoriaCard
              icon={<Award className="h-6 w-6" />}
              title="Selección Premium"
              description="Etiquetas exclusivas, ediciones limitadas y reservas para los paladares más exigentes."
              accent="rgba(180,50,78,0.20)"
            />
            <CategoriaCard
              icon={<Truck className="h-6 w-6" />}
              title="Domicilios"
              description="Entregas express en Medellín y área metropolitana, con seguimiento en tiempo real."
              accent="rgba(128,0,32,0.16)"
            />
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="border-t border-border/60 bg-gradient-to-b from-white/80 to-[#FFF7F8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Por qué Grandma's
            </span>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Más que una licorera, una experiencia premium.
            </h2>
            <p className="text-base text-muted-foreground">
              Construimos una plataforma profesional con gestión integral: clientes, pedidos, ventas
              y domicilios trabajando en armonía para que la atención sea impecable.
            </p>

            <ul className="space-y-3 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  ✓
                </span>
                Inventario en tiempo real, sin sorpresas en stock.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  ✓
                </span>
                Pedidos con seguimiento, abonos y métodos de pago flexibles.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  ✓
                </span>
                Soporte cercano y atención post-venta cuando la necesites.
              </li>
            </ul>

            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_rgba(128,0,32,0.25)] transition-transform hover:-translate-y-0.5"
            >
              Crear cuenta gratis
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { value: '+1.500', label: 'Pedidos entregados con éxito' },
              { value: '24/7', label: 'Atención todos los días del año' },
              { value: '+250', label: 'Etiquetas en catálogo curado' },
              { value: '99%', label: 'Clientes satisfechos en 2025' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-white/95 p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
              >
                <p className="text-3xl font-semibold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Contacto */}
      <section id="contacto" className="border-t border-border/60 bg-[#1C0A11] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Da el primer brindis con nosotros.
            </h2>
            <p className="max-w-xl text-base text-white/75">
              Crea tu cuenta gratis y disfruta de una experiencia de compra elegante, segura y a la
              altura de cada ocasión. Tu próxima botella favorita está a un par de clics.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onOpenRegister}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5"
              >
                Registrarme
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                Iniciar sesión
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Contáctanos</p>
            <h3 className="mt-2 text-xl font-semibold">Estamos cerca de ti</h3>
            <ul className="mt-5 space-y-4 text-sm text-white/85">
              <li className="flex items-start gap-3">
                <span className="rounded-xl bg-white/10 p-2 text-white">
                  <MapPin className="h-4 w-4" />
                </span>
                Calle 104 # 79D – 65, Medellín · Laureles
              </li>
              <li className="flex items-start gap-3">
                <span className="rounded-xl bg-white/10 p-2 text-white">
                  <Phone className="h-4 w-4" />
                </span>
                +57 324 610 2339
              </li>
              <li className="flex items-start gap-3">
                <span className="rounded-xl bg-white/10 p-2 text-white">
                  <Mail className="h-4 w-4" />
                </span>
                hola@grandmasliqueurs.com
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Grandma's Liqueurs · Licorera Virtual</p>
          <p>Bebamos con responsabilidad. Prohibida la venta a menores de edad.</p>
        </div>
      </footer>
    </div>
  );
}
