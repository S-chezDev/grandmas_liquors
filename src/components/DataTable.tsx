import React from 'react';
import { Search, Edit, Trash2, Eye, FileText, X } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface Action {
  label: string;
  icon: React.ReactNode | ((row: any) => React.ReactNode);
  onClick: (row: any) => void;
  variant?: 'default' | 'primary' | 'destructive' | 'outline';
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

const normalizeSearchValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';

  if (typeof value === 'string') {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).toLowerCase();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeSearchValue).join(' ');
  }

  if (value instanceof Date) {
    return value.toISOString().toLowerCase();
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(normalizeSearchValue)
      .join(' ');
  }

  return '';
};

export function DataTable({ 
  columns, 
  data, 
  actions = [], 
  onSearch,
  searchPlaceholder = "Buscar..."
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const normalizedQuery = React.useMemo(() => normalizeSearchValue(searchQuery), [searchQuery]);

  const filteredData = React.useMemo(() => {
    if (!normalizedQuery) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = normalizeSearchValue(row?.[column.key]);
        return value.includes(normalizedQuery);
      })
    );
  }, [columns, data, normalizedQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [normalizedQuery, data.length]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [currentPage, filteredData]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch?.('');
  };

  const getActionPriority = (label: string) => {
    const normalized = label.trim().toLowerCase();
    if (normalized.includes('ver detalle')) return 10;
    if (normalized === 'editar') return 20;
    if (normalized.includes('cambiar estado')) return 30;
    if (normalized.includes('anular')) return 40;
    if (normalized.includes('pdf')) return 50;
    if (normalized.includes('eliminar')) return 60;
    return 100;
  };

  const getRowKey = (row: any, index: number) => {
    if (row && row.id !== undefined && row.id !== null) {
      return String(row.id);
    }

    if (row && row.numero_pedido !== undefined && row.numero_pedido !== null) {
      return String(row.numero_pedido);
    }

    if (row && row.numero_venta !== undefined && row.numero_venta !== null) {
      return String(row.numero_venta);
    }

    return String(index);
  };

  const orderedActions = React.useMemo(
    () => [...actions].sort((left, right) => getActionPriority(left.label) - getActionPriority(right.label)),
    [actions]
  );

  return (
    <div className="bg-white rounded-lg border border-border">
      {/* Search Bar */}
      {onSearch && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-24 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-border hover:bg-accent transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left">
                  {column.label}
                </th>
              ))}
              {orderedActions.length > 0 && (
                <th className="px-4 py-3 text-left">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (orderedActions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                  {normalizedQuery ? 'No se encontraron resultados' : 'No hay datos disponibles'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={getRowKey(row, index)} className="border-t border-border hover:bg-accent/50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {orderedActions.length > 0 && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {orderedActions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={`p-2 rounded-lg transition-colors ${
                              action.variant === 'destructive'
                                ? 'hover:bg-destructive/10 text-destructive'
                                : action.variant === 'primary'
                                ? 'hover:bg-primary/10 text-primary'
                                : action.variant === 'outline'
                                ? 'border border-border hover:bg-accent'
                                : 'hover:bg-accent'
                            }`}
                            title={action.label}
                          >
                            {typeof action.icon === 'function' ? action.icon(row) : action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Placeholder */}
      {filteredData.length > 0 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredData.length)} de {filteredData.length} registro{filteredData.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              Anterior
            </button>
            <button
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Predefined action buttons
export const commonActions = {
  view: (onClick: (row: any) => void): Action => ({
    label: 'Ver detalle',
    icon: <Eye className="w-4 h-4" />,
    onClick
  }),
  edit: (onClick: (row: any) => void): Action => ({
    label: 'Editar',
    icon: <Edit className="w-4 h-4" />,
    onClick,
    variant: 'primary'
  }),
  delete: (onClick: (row: any) => void): Action => ({
    label: 'Eliminar',
    icon: <Trash2 className="w-4 h-4" />,
    onClick,
    variant: 'destructive'
  }),
  pdf: (onClick: (row: any) => void): Action => ({
    label: 'Ver PDF',
    icon: <FileText className="w-4 h-4" />,
    onClick
  }),
  cancel: (onClick: (row: any) => void): Action => ({
    label: 'Anular',
    icon: <X className="w-4 h-4" />,
    onClick,
    variant: 'destructive'
  })
};
