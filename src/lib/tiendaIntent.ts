const ADD_PRODUCT_ID = 'grandmas:tienda:addProductId';
const CATEGORIA = 'grandmas:tienda:categoria';

export function setTiendaIntent(opts: { addProductId?: number; categoriaNombre?: string }) {
  if (opts.addProductId != null && Number.isFinite(opts.addProductId)) {
    sessionStorage.setItem(ADD_PRODUCT_ID, String(opts.addProductId));
  }
  if (opts.categoriaNombre?.trim()) {
    sessionStorage.setItem(CATEGORIA, opts.categoriaNombre.trim());
  }
}

/** Lee y borra las claves para que solo se apliquen una vez. */
export function consumeTiendaIntent(): {
  addProductId: number | null;
  categoriaNombre: string | null;
} {
  const rawId = sessionStorage.getItem(ADD_PRODUCT_ID);
  const cat = sessionStorage.getItem(CATEGORIA);
  sessionStorage.removeItem(ADD_PRODUCT_ID);
  sessionStorage.removeItem(CATEGORIA);
  const id = rawId != null ? Number(rawId) : NaN;
  return {
    addProductId: Number.isFinite(id) ? id : null,
    categoriaNombre: cat?.trim() || null,
  };
}
