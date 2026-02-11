import React from 'react';
import { Search, Edit, Trash2, Eye, FileText, X } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
  variant?: 'default' | 'primary' | 'destructive';
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function DataTable({ 
  columns, 
  data, 
  actions = [], 
  onSearch,
  searchPlaceholder = "Buscar..."
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

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
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
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
              {actions.length > 0 && (
                <th className="px-4 py-3 text-left">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="border-t border-border hover:bg-accent/50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={`p-2 rounded-lg transition-colors ${
                              action.variant === 'destructive'
                                ? 'hover:bg-destructive/10 text-destructive'
                                : action.variant === 'primary'
                                ? 'hover:bg-primary/10 text-primary'
                                : 'hover:bg-accent'
                            }`}
                            title={action.label}
                          >
                            {action.icon}
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
      {data.length > 0 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {data.length} registro{data.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50" disabled>
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
