import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Clock,
  ChevronDown,
  CreditCard,
  Facebook,
  Gift,
  Heart,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  User,
  Wine,
  Youtube,
} from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { publicCatalog, type PublicCatalogProducto } from '../../services/api';
import { setTiendaIntent } from '../../lib/tiendaIntent';

type PublicHomeProps = {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
};

const ACCENT_GOLD = '#c5a572';
const INK = '#14120f';
const MUTED = '#5c534e';

const PASTEL_BACKDROPS = ['#e8d5ce', '#c5d5e8', '#d4e5d2', '#e5dcc9', '#ddd4e8', '#dce4e0', '#ebd9c5'];

/** Demostración visual si el catálogo público no está disponible (IDs no válidos en tienda). */
const FALLBACK_PRODUCTOS: PublicCatalogProducto[] = [
  {
    id: -1,
    nombre: 'Buchanan’s 18 Años',
    descripcion: 'Whisky escocés premium.',
    precio: 389900,
    imagen_url:
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80',
    categoria: 'Whisky',
  },
  {
    id: -2,
    nombre: 'Ron Zacapa Centenario',
    descripcion: 'Ron añejo guatemalteco.',
    precio: 289900,
    imagen_url:
      'https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?auto=format&fit=crop&w=800&q=80',
    categoria: 'Ron',
  },
  {
    id: -3,
    nombre: 'Don Julio Reposado',
    descripcion: 'Tequila reposado.',
    precio: 219000,
    imagen_url:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    categoria: 'Tequila',
  },
  {
    id: -4,
    nombre: 'Hendrick’s Gin',
    descripcion: 'Ginebra premium.',
    precio: 165000,
    imagen_url:
      'https://images.unsplash.com/photo-1551751299-1b51cab2694c?auto=format&fit=crop&w=800&q=80',
    categoria: 'Ginebra',
  },
  {
    id: -5,
    nombre: 'Moët & Chandon Brut',
    descripcion: 'Champagne brut.',
    precio: 285000,
    imagen_url:
      'https://images.unsplash.com/photo-1605270012917-bf157c5a9541?auto=format&fit=crop&w=800&q=80',
    categoria: 'Champagne',
  },
  {
    id: -6,
    nombre: 'Aguardiente Antioqueño',
    descripcion: 'Tradición colombiana.',
    precio: 58900,
    imagen_url:
      'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=800&q=80',
    categoria: 'Aguardiente',
  },
];

const TRUST_BADGES = [
  { icon: <ShieldCheck className="h-5 w-5" />, label: 'Productos 100% originales' },
  { icon: <Lock className="h-5 w-5" />, label: 'Pago seguro y encriptado' },
  { icon: <Clock className="h-5 w-5" />, label: 'Atención 24/7 vía WhatsApp' },
  { icon: <Award className="h-5 w-5" />, label: 'Selección curada premium' },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

function GrandmaLogo({ inverted = false }: { inverted?: boolean }) {
  const fg = inverted ? 'text-white' : 'text-[#800020]';
  const sub = inverted ? 'text-white/70' : 'text-[#7A1F3D]/70';
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border ${
          inverted ? 'border-white/40 bg-white/10' : 'border-[#800020]/20 bg-[#800020]/8'
        }`}
      >
        <span className={`font-display text-xl font-semibold ${fg}`}>G</span>
      </div>
      <div className="leading-tight">
        <p className={`font-display text-lg sm:text-xl ${fg}`}>Grandma’s Liqueurs</p>
        <p className={`text-[11px] uppercase tracking-[0.28em] ${sub}`}>Selección premium</p>
      </div>
    </div>
  );
}

function VintageLogoMark({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <div className="relative mx-auto inline-block rounded-lg border-2 px-5 py-3 shadow-sm sm:px-8 sm:py-4" style={{ borderColor: ACCENT_GOLD }}>
        <span className="absolute -top-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-[#f3f2ef] text-[9px] font-bold uppercase tracking-tight text-[#14120f]" style={{ borderColor: ACCENT_GOLD }}>
          24h
        </span>
        <p className="font-display text-lg font-semibold tracking-tight text-[#14120f] sm:text-2xl">
          Grandma’s Liqueurs
        </p>
        <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.35em] text-[#5c534e]">
          Est. 2012
        </p>
        <p className="text-[10px] text-[#5c534e]/90">grandmasliqueurs.co</p>
      </div>
    </div>
  );
}

function FloatingDock({
  onMenu,
  onSearchFocus,
  onCart,
  onLogin,
}: {
  onMenu: () => void;
  onSearchFocus: () => void;
  onCart: () => void;
  onLogin: () => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 md:flex">
      <div
        className="pointer-events-auto flex flex-col gap-2 rounded-full border border-black/10 bg-white/95 px-2 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md"
        aria-label="Accesos rápidos"
      >
        <button
          type="button"
          onClick={onMenu}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#14120f] transition-colors hover:bg-black/5"
          aria-label="Menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <a
          href="tel:+573044848594"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#14120f] transition-colors hover:bg-black/5"
          aria-label="Llamar"
        >
          <Phone className="h-5 w-5" />
        </a>
        <button
          type="button"
          onClick={onCart}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-105"
          style={{ backgroundColor: ACCENT_GOLD }}
          aria-label="Carrito"
        >
          <ShoppingBag className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onSearchFocus}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#14120f] transition-colors hover:bg-black/5"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onLogin}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#14120f] transition-colors hover:bg-black/5"
          aria-label="Mi cuenta"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function PublicChrome({
  searchQuery,
  onSearchChange,
  searchInputRef,
  isMenuOpen,
  setIsMenuOpen,
  locationLabel,
  onLocationChange,
  onOpenLogin,
  onOpenRegister,
}: {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
  locationLabel: string;
  onLocationChange: (v: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}) {
  const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f3f2ef]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 pt-4 pb-2 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wider text-[#14120f] hover:bg-black/5 sm:text-sm"
              style={{ color: INK }}
            >
              <Menu className="h-4 w-4" />
              Menú
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 flex -translate-y-1/2 items-center gap-1" style={{ color: INK }}>
                <MapPin className="h-3.5 w-3.5" />
              </span>
              <select
                value={locationLabel}
                onChange={(e) => onLocationChange(e.target.value)}
                className="appearance-none rounded-lg border border-black/15 bg-white py-2 pl-8 pr-8 text-xs font-semibold uppercase tracking-wider sm:text-sm"
                style={{ color: INK }}
                aria-label="Ciudad de entrega"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-50" />
            </div>
          </div>

          <div className="order-last flex w-full basis-full justify-center sm:order-none sm:basis-auto md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2">
            <VintageLogoMark />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-black/5 sm:text-sm"
              style={{ color: INK }}
            >
              <ShoppingBag className="h-4 w-4" />
              Carrito
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl px-0">
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 shrink-0 text-black/40" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="¿Qué estás buscando?"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#14120f] outline-none placeholder:text-black/40"
              style={{ color: INK }}
            />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-black/10 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {['Tienda', 'Whisky', 'Ron', 'Vinos', 'Cervezas', 'Anchetas', 'Recetas'].map((link) => (
              <button
                key={link}
                type="button"
                className="rounded-md px-3 py-2 text-left text-sm text-[#14120f] transition-colors hover:bg-black/5"
                onClick={() => {
                  if (link === 'Recetas') {
                    document.getElementById('recetas')?.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsMenuOpen(false);
                }}
              >
                {link}
              </button>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="outline" onClick={onOpenLogin} className="flex-1">
                Iniciar sesión
              </Button>
              <Button onClick={onOpenRegister} className="flex-1">
                Crear cuenta
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function LicoreraHero({ onOpenLogin, onRecipes }: { onOpenLogin: () => void; onRecipes: () => void }) {
  const heroImg =
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80';

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-black sm:rounded-[2rem]">
          <div
            className="absolute inset-0 bg-cover bg-right opacity-40"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />

          <div className="relative px-5 py-10 sm:px-10 sm:py-14">
            <div className="mb-6 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50 sm:text-xs">
              {['Destilados', 'Cócteles', 'Regalos'].map((label, i) => (
                <span key={label} className="flex items-center gap-2">
                  {i > 0 ? <span className="h-px w-6 bg-white/25" /> : null}
                  {label}
                </span>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
              <div className="space-y-4">
                <p className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
                  Cocteles
                </p>
                <p className="max-w-md text-sm text-white/75 sm:text-base">
                  Recetas y selección curada para elevar tu bar en casa. Inicia sesión para armar tu
                  pedido con entrega express.
                </p>
                <button
                  type="button"
                  onClick={onRecipes}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black"
                >
                  Ver recetas
                </button>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                  Selección
                  <br />
                  premium
                </h2>
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <Button
                    onClick={onOpenLogin}
                    size="lg"
                    className="border-0 bg-[#c5a572] text-[#14120f] shadow-lg hover:bg-[#b8925f]"
                  >
                    Explorar tienda
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid gap-3 rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_BADGES.map((badge) => (
          <div key={badge.label} className="flex items-center gap-3 text-sm text-[#14120f]">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#14120f]"
              style={{ backgroundColor: 'rgba(197,165,114,0.25)' }}
            >
              {badge.icon}
            </span>
            <span className="font-medium">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

type CatRow = { id: number; nombre: string };

function CategoriesScroller({
  categorias,
  selectedNombre,
  onSelect,
}: {
  categorias: CatRow[];
  selectedNombre: string | null;
  onSelect: (nombre: string | null) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setScrollPct(max <= 0 ? 0 : el.scrollLeft / max);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [categorias.length]);

  const list: CatRow[] =
    categorias.length > 0
      ? categorias
      : Array.from(new Set(FALLBACK_PRODUCTOS.map((p) => p.categoria))).map((nombre, id) => ({
          id: -id - 1,
          nombre,
        }));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-[1.35rem] border border-black/10 bg-white px-4 py-8 shadow-[0_16px_48px_rgba(0,0,0,0.07)] sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em]" style={{ color: ACCENT_GOLD }}>
              Nuestras categorías
            </p>
            <h2 className="font-display mt-1 text-3xl text-[#14120f] sm:text-4xl">
              Explora nuestra variedad de licores
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#5c534e]">
              Toca una categoría para filtrar el catálogo. Los datos provienen de nuestro inventario
              en tiempo casi real.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="inline-flex items-center gap-2 self-start rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-[#14120f] hover:bg-black/5 sm:self-auto"
          >
            Quitar filtro <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {list.map((cat, i) => {
            const active = selectedNombre === cat.nombre;
            return (
              <button
                key={`${cat.id}-${cat.nombre}`}
                type="button"
                onClick={() => onSelect(active ? null : cat.nombre)}
                className={`group flex w-[100px] shrink-0 snap-start flex-col items-center gap-3 sm:w-[120px] ${
                  active ? 'opacity-100' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <span
                  className="flex h-24 w-24 items-center justify-center rounded-full shadow-inner transition-transform group-hover:scale-105 sm:h-28 sm:w-28"
                  style={{ backgroundColor: PASTEL_BACKDROPS[i % PASTEL_BACKDROPS.length] }}
                >
                  <Wine className="h-11 w-11 -rotate-12 text-black/30 transition-transform group-hover:rotate-[-8deg]" />
                </span>
                <span
                  className={`text-center text-xs font-medium leading-tight sm:text-sm ${
                    active ? 'text-[#14120f]' : 'text-[#5c534e]'
                  }`}
                >
                  {cat.nombre}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mt-5 h-1.5 w-full rounded-full bg-black/10">
          <div
            className="absolute top-0 h-full w-[28%] rounded-full bg-[#14120f] transition-[left] duration-75 ease-out"
            style={{ left: `${scrollPct * 72}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function PromoRow({
  onOpenLogin,
  onFilterCategory,
}: {
  onOpenLogin: () => void;
  onFilterCategory: (nombre: string) => void;
}) {
  const cards = [
    {
      title: 'Reserva premium',
      subtitle: 'Destilados seleccionados',
      className: 'bg-[#1a2744] text-white',
      accent: 'from-fuchsia-500/20 to-transparent',
      onClick: () => onFilterCategory('Whisky'),
    },
    {
      title: 'Anchetas & regalo',
      subtitle: 'Empaque y detalle',
      className: 'bg-[#ede6d8] text-[#14120f]',
      accent: 'from-amber-400/25 to-transparent',
      onClick: () => onOpenLogin(),
    },
    {
      title: 'Ediciones especiales',
      subtitle: 'Champagne y más',
      className: 'bg-[#a67c52] text-white',
      accent: 'from-yellow-200/15 to-transparent',
      onClick: () => onFilterCategory('Champagne'),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={card.onClick}
            className={`group relative overflow-hidden rounded-[1.75rem] p-6 text-left shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:p-8 ${card.className}`}
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent}`} />
            <Gift className="relative mb-4 h-10 w-10 opacity-90" />
            <h3 className="relative font-display text-xl sm:text-2xl">{card.title}</h3>
            <p className="relative mt-1 text-sm opacity-80">{card.subtitle}</p>
            <span className="relative mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              Explorar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CatalogProductCard({
  product,
  fromLiveApi,
  onDetail,
  onAdd,
}: {
  product: PublicCatalogProducto;
  fromLiveApi: boolean;
  onDetail: () => void;
  onAdd: () => void;
}) {
  const img =
    product.imagen_url?.trim() ||
    'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
      <button type="button" onClick={onDetail} className="relative block h-52 w-full overflow-hidden bg-[#f3f2ef] text-left sm:h-56">
        <img
          src={img}
          alt={product.nombre}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#14120f] shadow-md">
          <Heart className="h-4 w-4" />
        </span>
      </button>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <button type="button" onClick={onDetail} className="space-y-1 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5c534e]">{product.categoria}</p>
          <h3 className="font-display text-lg text-[#14120f]">{product.nombre}</h3>
        </button>
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star key={idx} className={`h-3.5 w-3.5 ${idx < 4 ? 'fill-current' : 'text-amber-500/25'}`} />
          ))}
          <span className="ml-1 text-xs text-[#5c534e]">Destacado</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <p className="font-display text-xl text-[#14120f]">{formatCurrency(Number(product.precio) || 0)}</p>
          <Button
            onClick={onAdd}
            size="sm"
            className="border-0 bg-[#c5a572] text-[#14120f] shadow-md hover:bg-[#b8925f]"
          >
            <ShoppingBag className="h-4 w-4" />
            Añadir
          </Button>
        </div>
        {!fromLiveApi && (
          <p className="text-[11px] text-amber-800/80">Vista demo: conecta el backend para comprar.</p>
        )}
      </div>
    </article>
  );
}

function FeaturedCatalogSection({
  productos,
  loading,
  catalogError,
  fromLiveApi,
  onDetail,
  onAdd,
  onOpenLogin,
  onOpenRegister,
}: {
  productos: PublicCatalogProducto[];
  loading: boolean;
  catalogError: boolean;
  fromLiveApi: boolean;
  onDetail: (p: PublicCatalogProducto) => void;
  onAdd: (p: PublicCatalogProducto) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em]" style={{ color: ACCENT_GOLD }}>
            Catálogo
          </p>
          <h2 className="font-display text-3xl text-[#14120f] sm:text-4xl">Productos disponibles</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#5c534e]">
            Inicia sesión para añadir al carrito y completar tu pedido. Los precios se confirman en la tienda.
          </p>
          {catalogError && (
            <p className="mt-2 text-sm text-amber-800">No fue posible cargar el catálogo en vivo; mostramos una vista de demostración.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              onOpenLogin();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-[#14120f] hover:bg-black/5"
          >
            Ver tienda completa <ArrowRight className="h-4 w-4" />
          </button>
          <Button variant="outline" size="sm" onClick={onOpenRegister}>
            Crear cuenta
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-3xl bg-black/5" />
          ))}
        </div>
      ) : productos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/15 bg-white py-12 text-center text-sm text-[#5c534e]">
          No hay productos que coincidan con tu búsqueda o filtro.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((product) => (
            <CatalogProductCard
              key={`${product.id}-${product.nombre}`}
              product={product}
              fromLiveApi={fromLiveApi}
              onDetail={() => onDetail(product)}
              onAdd={() => onAdd(product)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PromoBanner({ onAction }: { onAction: () => void }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#7A1F3D]/20 bg-[linear-gradient(135deg,#1c0a11_0%,#3d0e22_55%,#5a1130_100%)] px-6 py-12 text-white sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,201,122,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(255,180,210,0.12),transparent_40%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em]">
              <CreditCard className="h-3.5 w-3.5" /> Precios especiales
            </span>
            <h2 className="font-display text-3xl sm:text-4xl">
              ¿Buscas precios realmente especiales? Ahorra hasta un 30% en tu primera compra.
            </h2>
            <p className="max-w-xl text-sm text-white/80 sm:text-base">
              Regístrate, accede a descuentos exclusivos por categoría y recibe códigos
              promocionales antes que nadie.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={onAction} size="lg" className="shadow-lg shadow-black/20">
                Ver descuentos
                <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-xs text-white/70">Aplica Términos y Condiciones</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Whisky reserva', value: '-15%' },
              { label: 'Vinos premium', value: '-20%' },
              { label: 'Cócteles', value: '-25%' },
              { label: 'Anchetas', value: '-30%' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm"
              >
                <p className="font-display text-3xl text-[#f5c97a]">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CocktailsSection({ onAction }: { onAction: () => void }) {
  const cocktails = [
    {
      title: 'Old Fashioned',
      description: 'Whisky bourbon, azúcar, angostura y un toque cítrico.',
      image:
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80',
      tag: 'Clásico',
    },
    {
      title: 'Aperol Spritz',
      description: 'Aperol, prosecco y soda. Refrescante y elegante.',
      image:
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80',
      tag: 'Verano',
    },
    {
      title: 'Negroni de la abuela',
      description: 'Ginebra, vermut rojo y campari con un twist artesanal.',
      image:
        'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=80',
      tag: 'Signature',
    },
  ];

  return (
    <section id="recetas" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#7A1F3D]">
            Recetas de cócteles
          </p>
          <h2 className="font-display text-3xl text-[#1c0a11] sm:text-4xl">
            Aprende a preparar como un bartender
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#6A4A57]">
            Recetas paso a paso, ingredientes recomendados y enlaces directos para comprar todo lo
            que necesitas.
          </p>
        </div>
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-full border border-[#7A1F3D]/25 px-4 py-2 text-sm font-medium text-[#7A1F3D] transition-colors hover:bg-[#7A1F3D]/5"
        >
          Ver todas las recetas <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {cocktails.map((cocktail) => (
          <article
            key={cocktail.title}
            className="group relative overflow-hidden rounded-3xl border border-[#7A1F3D]/12 bg-white shadow-[0_8px_24px_rgba(28,10,17,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(28,10,17,0.16)]"
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={cocktail.image}
                alt={cocktail.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7A1F3D]">
                {cocktail.tag}
              </span>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <h3 className="font-display text-2xl">{cocktail.title}</h3>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm text-[#6A4A57]">{cocktail.description}</p>
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A1F3D] transition-colors hover:text-[#800020]"
              >
                Ver receta completa <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScheduleAndCoverage() {
  const cities = [
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Cartagena',
    'Bucaramanga',
    'Pereira',
    'Manizales',
    'Santa Marta',
    'Ibagué',
    'Villavicencio',
    'Cúcuta',
  ];

  return (
    <section className="bg-[#1c0a11] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em]">
            <Clock className="h-3.5 w-3.5" /> Horarios y entregas
          </span>
          <h2 className="font-display text-3xl sm:text-4xl">
            Pedidos 24/7 y entregas en toda Colombia
          </h2>
          <p className="text-sm text-white/75 sm:text-base">
            Selecciona la fecha y hora de entrega que más te convenga. Nuestros mensajeros entregan
            tus pedidos con empaque seguro y discrecional.
          </p>
          <ul className="space-y-3 text-sm text-white/85">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5c97a]/15 text-[#f5c97a]">
                <Clock className="h-4 w-4" />
              </span>
              Pedidos web disponibles las 24 horas
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5c97a]/15 text-[#f5c97a]">
                <Truck className="h-4 w-4" />
              </span>
              Entregas en menos de 60 minutos en zonas habilitadas
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5c97a]/15 text-[#f5c97a]">
                <ShieldCheck className="h-4 w-4" />
              </span>
              Verificación de mayoría de edad al recibir
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3 text-white/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <MapPin className="h-5 w-5 text-[#f5c97a]" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Cobertura nacional</p>
              <p className="font-display text-xl text-white">Estamos cerca de ti</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {cities.map((city) => (
              <span
                key={city}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-center text-xs uppercase tracking-[0.18em] text-white/85"
              >
                {city}
              </span>
            ))}
          </div>
          <p className="mt-5 text-xs text-white/60">
            ¿No ves tu ciudad? Contáctanos por WhatsApp y te confirmamos disponibilidad.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#11060a] text-white/85">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
        <div className="space-y-4">
          <GrandmaLogo inverted />
          <p className="text-sm text-white/65">
            Plataforma colombiana de licores premium con domicilio express, anchetas personalizadas
            y experiencias de coctelería.
          </p>
          <div className="flex items-center gap-3 text-white/70">
            <a className="rounded-full border border-white/20 p-2 hover:border-[#f5c97a]" href="#">
              <Facebook className="h-4 w-4" />
            </a>
            <a className="rounded-full border border-white/20 p-2 hover:border-[#f5c97a]" href="#">
              <Instagram className="h-4 w-4" />
            </a>
            <a className="rounded-full border border-white/20 p-2 hover:border-[#f5c97a]" href="#">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-display text-lg text-white">Productos</p>
          <ul className="mt-4 space-y-2 text-sm">
            {['Whisky', 'Ron', 'Vinos', 'Tequila', 'Cervezas', 'Anchetas', 'Recetas'].map((item) => (
              <li key={item}>
                <a href="#" className="text-white/70 transition-colors hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-lg text-white">Acerca de</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              'Sobre nosotros',
              'Blog',
              'Tarjetas de regalo',
              'Política de privacidad',
              'Términos y condiciones',
            ].map((item) => (
              <li key={item}>
                <a href="#" className="text-white/70 transition-colors hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="font-display text-lg text-white">Contacto</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[#f5c97a]" />
              <span>Cra. 47 # 104 - 45, Oficina principal</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-[#f5c97a]" />
              <span>(601) 382 7017 · 300 203 5430</span>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 text-[#f5c97a]" />
              <span>WhatsApp 304 484 8594</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-[#f5c97a]" />
              <span>contacto@grandmasliqueurs.co</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Grandma’s Liqueurs · Todos los derechos reservados.</p>
          <p className="max-w-xl text-right text-[11px] leading-relaxed text-white/45">
            El exceso de alcohol es perjudicial para la salud. Ley 30 de 1986. Prohíbase el expendio
            de bebidas embriagantes a menores de edad.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PublicHome({ onOpenLogin, onOpenRegister }: PublicHomeProps) {
  const [catalog, setCatalog] = useState<{
    productos: PublicCatalogProducto[];
    categorias: CatRow[];
  } | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState('Bogotá');
  const [detailProduct, setDetailProduct] = useState<PublicCatalogProducto | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await publicCatalog.getCatalogo();
        if (!cancelled) {
          setCatalog({
            productos: Array.isArray(data.productos) ? data.productos : [],
            categorias: Array.isArray(data.categorias) ? data.categorias : [],
          });
        }
      } catch {
        if (!cancelled) setCatalogError(true);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fromLiveApi = !catalogError && catalog !== null;

  const filteredProductos = useMemo(() => {
    if (catalogLoading) return [];
    const source =
      catalogError || catalog == null ? FALLBACK_PRODUCTOS : catalog.productos;
    let list = [...source];
    if (filterCategory) list = list.filter((p) => p.categoria === filterCategory);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          (p.descripcion || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [catalog, catalogError, catalogLoading, filterCategory, searchQuery]);

  const handleAddProduct = (p: PublicCatalogProducto) => {
    if (fromLiveApi && p.id > 0) {
      setTiendaIntent({ addProductId: p.id, categoriaNombre: p.categoria });
    }
    onOpenLogin();
  };

  return (
    <div className="min-h-screen text-[#14120f]" style={{ backgroundColor: '#f3f2ef' }}>
      <FloatingDock
        onMenu={() => setIsMenuOpen((o) => !o)}
        onSearchFocus={() => searchInputRef.current?.focus()}
        onCart={onOpenLogin}
        onLogin={onOpenLogin}
      />
      <PublicChrome
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchInputRef={searchInputRef}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        locationLabel={locationLabel}
        onLocationChange={setLocationLabel}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
      />
      <main>
        <LicoreraHero
          onOpenLogin={onOpenLogin}
          onRecipes={() =>
            document.getElementById('recetas')?.scrollIntoView({ behavior: 'smooth' })
          }
        />
        <TrustStrip />
        <CategoriesScroller
          categorias={catalog?.categorias ?? []}
          selectedNombre={filterCategory}
          onSelect={setFilterCategory}
        />
        <PromoRow onOpenLogin={onOpenLogin} onFilterCategory={(n) => setFilterCategory(n)} />
        <FeaturedCatalogSection
          productos={filteredProductos}
          loading={catalogLoading}
          catalogError={catalogError}
          fromLiveApi={fromLiveApi}
          onDetail={setDetailProduct}
          onAdd={handleAddProduct}
          onOpenLogin={onOpenLogin}
          onOpenRegister={onOpenRegister}
        />
        <PromoBanner onAction={onOpenRegister} />
        <CocktailsSection onAction={onOpenLogin} />
        <ScheduleAndCoverage />
      </main>
      <Footer />
      <Modal
        isOpen={detailProduct != null}
        onClose={() => setDetailProduct(null)}
        title={detailProduct?.nombre ?? 'Detalle'}
        size="md"
        contentClassName="bg-[#f3f2ef]"
      >
        {detailProduct && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
              <img
                src={
                  detailProduct.imagen_url?.trim() ||
                  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=900&q=80'
                }
                alt=""
                className="max-h-72 w-full object-cover"
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5c534e]">
              {detailProduct.categoria}
            </p>
            <p className="font-display text-2xl">
              {formatCurrency(Number(detailProduct.precio) || 0)}
            </p>
            <p className="text-sm leading-relaxed text-[#5c534e]">
              {detailProduct.descripcion || 'Sin descripción adicional.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={() => {
                  handleAddProduct(detailProduct);
                  setDetailProduct(null);
                }}
                className="border-0 bg-[#c5a572] text-[#14120f] hover:bg-[#b8925f]"
              >
                Añadir al carrito
              </Button>
              <Button variant="outline" onClick={() => setDetailProduct(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
