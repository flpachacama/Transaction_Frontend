import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

const API_BASE = 'http://localhost:3002';
const API_BP = `${API_BASE}/bp/products`;
const DEFAULT_LOGO_URL = 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Product>({
    id: '',
    name: '',
    description: '',
    logo: DEFAULT_LOGO_URL,
    date_release: '',
    date_revision: '',
  });

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }, [search, products]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BP);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err: any) {
      setError(err.message ?? 'Unexpected error while loading products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (form.date_release) {
      const release = new Date(form.date_release);
      if (!Number.isNaN(release.getTime())) {
        const revision = new Date(release);
        revision.setFullYear(revision.getFullYear() + 1);
        setForm((prev) => ({
          ...prev,
          date_revision: revision.toISOString().slice(0, 10),
        }));
      }
    }
  }, [form.date_release]);

  const resetForm = () => {
    setForm({
      id: '',
      name: '',
      description: '',
      logo: DEFAULT_LOGO_URL,
      date_release: '',
      date_revision: '',
    });
    setFormErrors({});
  };

  const openCreate = () => {
    resetForm();
    setSelectedProduct(null);
    setPage('create');
  };

  const openEdit = (product: Product) => {
    setSelectedProduct(product);
    setForm(product);
    setFormErrors({});
    setPage('edit');
  };

  const validateForm = async (mode: 'create' | 'edit') => {
    const errors: Record<string, string> = {};
    const id = form.id.trim();
    const name = form.name.trim();
    const description = form.description.trim();
    const logo = form.logo.trim();

    if (!id) errors.id = 'ID es requerido';
    else if (id.length < 3 || id.length > 10) errors.id = 'ID debe tener entre 3 y 10 caracteres';

    if (!name) errors.name = 'Nombre es requerido';
    else if (name.length < 5 || name.length > 100) errors.name = 'Nombre debe tener entre 5 y 100 caracteres';

    if (!description) errors.description = 'Descripción es requerida';
    else if (description.length < 10 || description.length > 200) errors.description = 'Descripción debe tener entre 10 y 200 caracteres';

    if (!logo) errors.logo = 'Logo es requerido';

    const release = new Date(form.date_release);
    if (!form.date_release || Number.isNaN(release.getTime())) {
      errors.date_release = 'Fecha de liberación inválida';
    } else {
      const today = new Date();
      const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      const releaseDay = Date.UTC(release.getFullYear(), release.getMonth(), release.getDate());
      if (releaseDay < todayDay) errors.date_release = 'Debe ser hoy o una fecha futura';
    }

    const revision = new Date(form.date_revision);
    if (!form.date_revision || Number.isNaN(revision.getTime())) {
      errors.date_revision = 'Fecha de revisión inválida';
    } else if (!Number.isNaN(release.getTime())) {
      const expected = new Date(release);
      expected.setFullYear(expected.getFullYear() + 1);
      const expectedDay = Date.UTC(expected.getFullYear(), expected.getMonth(), expected.getDate());
      const revisionDay = Date.UTC(revision.getFullYear(), revision.getMonth(), revision.getDate());
      if (expectedDay !== revisionDay) errors.date_revision = 'Debe ser exactamente un año posterior';
    }

    if (mode === 'create' && !errors.id) {
      try {
        const res = await fetch(`${API_BP}/verification/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('No se pudo validar el ID');
        const exists = await res.json();
        if (exists === true) errors.id = 'Este ID ya existe';
      } catch (e) {
        errors.id = 'No se pudo verificar el ID';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (mode: 'create' | 'edit') => {
    const isValid = await validateForm(mode);
    if (!isValid) return;

    setSaving(true);
    setError(null);
    try {
      const body = {
        ...(mode === 'create' ? { id: form.id.trim() } : {}),
        name: form.name.trim(),
        description: form.description.trim(),
        logo: form.logo.trim(),
        date_release: form.date_release,
        date_revision: form.date_revision,
      };

      const url = mode === 'create' ? API_BP : `${API_BP}/${encodeURIComponent(form.id)}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message ?? `Error ${res.status}`);
      }

      await loadProducts();
      setPage('list');
      setSelectedProduct(null);
      resetForm();
    } catch (err: any) {
      setError(err.message ?? 'No se pudo guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BP}/${encodeURIComponent(confirmDelete.id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.message ?? `Error ${res.status}`);
      }
      await loadProducts();
      setConfirmDelete(null);
      setPage('list');
      setSelectedProduct(null);
    } catch (err: any) {
      setError(err.message ?? 'No se pudo eliminar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setPage('detail');
  };

  return (
    <div className="app">
      <main className="phone-shell">
        <header className="header">
          <h1>BANCO</h1>
        </header>
        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">Cargando...</div>}

        {page === 'list' && (
          <section className="list-page">
            <div className="toolbar">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="product-list">
              {filteredProducts.length === 0 ? (
                <p className="empty-cell">No hay productos para mostrar</p>
              ) : (
                filteredProducts.map((product) => (
                  <button key={product.id} className="product-item" onClick={() => handleSelectProduct(product)}>
                    <div>
                      <p className="item-name">{product.name}</p>
                      <p className="item-id">ID: {product.id}</p>
                    </div>
                    <span className="item-arrow">&#8250;</span>
                  </button>
                ))
              )}
            </div>

            <div className="list-footer">
              <p className="counter">{filteredProducts.length} Registros</p>
              <button className="btn btn-primary btn-add-main" onClick={openCreate}>Agregar</button>
            </div>
          </section>
        )}

        {page === 'detail' && selectedProduct && (
          <section className="detail-page">
            <div className="form-card">
              <h2>ID: {selectedProduct.id}</h2>
              <p className="subtitle">Información extra</p>
              <div className="detail-logo-wrapper">
                <img
                  className="detail-logo"
                  src={selectedProduct.logo || DEFAULT_LOGO_URL}
                  alt={selectedProduct.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_LOGO_URL;
                  }}
                />
              </div>
              <div className="detail-row"><span>Nombre</span><strong>{selectedProduct.name}</strong></div>
              <div className="detail-row"><span>Descripción</span><strong>{selectedProduct.description}</strong></div>
              <div className="detail-row"><span>Logo</span><span></span></div>
              <div className="detail-row"><span>Fecha liberación</span><strong>{selectedProduct.date_release}</strong></div>
              <div className="detail-row"><span>Fecha revisión</span><strong>{selectedProduct.date_revision}</strong></div>
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setPage('list')}>Volver</button>
                <button className="btn btn-neutral" onClick={() => openEdit(selectedProduct)}>Editar</button>
                <button className="btn btn-danger" onClick={() => setConfirmDelete(selectedProduct)}>Eliminar</button>
              </div>
            </div>
          </section>
        )}

        {(page === 'create' || page === 'edit') && (
          <section className="form-page">
            <div className="form-card">
              <h2>Formulario de Registro</h2>
              <div className="form-grid">
                <label>
                  ID
                  <input
                    value={form.id}
                    disabled={page === 'edit'}
                    onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
                    className={formErrors.id ? 'input-error' : ''}
                  />
                  {formErrors.id && <span className="field-error">{formErrors.id}</span>}
                </label>
                <label>
                  Nombre
                  <input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className={formErrors.name ? 'input-error' : ''}
                  />
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </label>
                <label>
                  Descripción
                  <input
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className={formErrors.description ? 'input-error' : ''}
                  />
                  {formErrors.description && <span className="field-error">{formErrors.description}</span>}
                </label>
                <label>
                  Logo
                  <input
                    value={form.logo}
                    onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
                    className={formErrors.logo ? 'input-error' : ''}
                  />
                  {formErrors.logo && <span className="field-error">{formErrors.logo}</span>}
                </label>
                <label>
                  Fecha Liberación
                  <input
                    type="date"
                    value={form.date_release}
                    onChange={(e) => setForm((prev) => ({ ...prev, date_release: e.target.value }))}
                    className={formErrors.date_release ? 'input-error' : ''}
                  />
                  {formErrors.date_release && <span className="field-error">{formErrors.date_release}</span>}
                </label>
                <label>
                  Fecha Revisión
                  <input
                    type="date"
                    value={form.date_revision}
                    disabled
                    className={formErrors.date_revision ? 'input-error' : ''}
                  />
                  {formErrors.date_revision && <span className="field-error">{formErrors.date_revision}</span>}
                </label>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" disabled={saving} onClick={() => handleSave(page)}>
                  {saving ? 'Guardando...' : page === 'create' ? 'Enviar' : 'Guardar Cambios'}
                </button>
                <button className="btn btn-neutral" onClick={resetForm}>Reiniciar</button>
                <button className="btn btn-secondary" onClick={() => setPage('list')}>Cancelar</button>
              </div>
            </div>
          </section>
        )}
      </main>

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setConfirmDelete(null)}>&times;</button>
            <p>¿Estás seguro de eliminar el producto {confirmDelete.name}?</p>
            <div className="form-actions">
              <button className="btn btn-primary" disabled={saving} onClick={handleDelete}>
                {saving ? 'Eliminando...' : 'Confirmar'}
              </button>
              <button className="btn btn-neutral" onClick={() => setConfirmDelete(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
