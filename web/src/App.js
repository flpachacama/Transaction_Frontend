import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import './App.css';
const API_BASE = 'http://localhost:3002';
const API_BP = `${API_BASE}/bp/products`;
const DEFAULT_LOGO_URL = 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg';
function App() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState('list');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        id: '',
        name: '',
        description: '',
        logo: DEFAULT_LOGO_URL,
        date_release: '',
        date_revision: '',
    });
    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q)
            return products;
        return products.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }, [search, products]);
    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_BP);
            if (!res.ok)
                throw new Error(`Error ${res.status}`);
            const data = await res.json();
            setProducts(data.data || []);
        }
        catch (err) {
            setError(err.message ?? 'Unexpected error while loading products');
        }
        finally {
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
    const openEdit = (product) => {
        setSelectedProduct(product);
        setForm(product);
        setFormErrors({});
        setPage('edit');
    };
    const validateForm = async (mode) => {
        const errors = {};
        const id = form.id.trim();
        const name = form.name.trim();
        const description = form.description.trim();
        const logo = form.logo.trim();
        if (!id)
            errors.id = 'ID es requerido';
        else if (id.length < 3 || id.length > 10)
            errors.id = 'ID debe tener entre 3 y 10 caracteres';
        if (!name)
            errors.name = 'Nombre es requerido';
        else if (name.length < 5 || name.length > 100)
            errors.name = 'Nombre debe tener entre 5 y 100 caracteres';
        if (!description)
            errors.description = 'Descripción es requerida';
        else if (description.length < 10 || description.length > 200)
            errors.description = 'Descripción debe tener entre 10 y 200 caracteres';
        if (!logo)
            errors.logo = 'Logo es requerido';
        const release = new Date(form.date_release);
        if (!form.date_release || Number.isNaN(release.getTime())) {
            errors.date_release = 'Fecha de liberación inválida';
        }
        else {
            const today = new Date();
            const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
            const releaseDay = Date.UTC(release.getFullYear(), release.getMonth(), release.getDate());
            if (releaseDay < todayDay)
                errors.date_release = 'Debe ser hoy o una fecha futura';
        }
        const revision = new Date(form.date_revision);
        if (!form.date_revision || Number.isNaN(revision.getTime())) {
            errors.date_revision = 'Fecha de revisión inválida';
        }
        else if (!Number.isNaN(release.getTime())) {
            const expected = new Date(release);
            expected.setFullYear(expected.getFullYear() + 1);
            const expectedDay = Date.UTC(expected.getFullYear(), expected.getMonth(), expected.getDate());
            const revisionDay = Date.UTC(revision.getFullYear(), revision.getMonth(), revision.getDate());
            if (expectedDay !== revisionDay)
                errors.date_revision = 'Debe ser exactamente un año posterior';
        }
        if (mode === 'create' && !errors.id) {
            try {
                const res = await fetch(`${API_BP}/verification/${encodeURIComponent(id)}`);
                if (!res.ok)
                    throw new Error('No se pudo validar el ID');
                const exists = await res.json();
                if (exists === true)
                    errors.id = 'Este ID ya existe';
            }
            catch (e) {
                errors.id = 'No se pudo verificar el ID';
            }
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSave = async (mode) => {
        const isValid = await validateForm(mode);
        if (!isValid)
            return;
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
        }
        catch (err) {
            setError(err.message ?? 'No se pudo guardar el producto');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDelete = async () => {
        if (!confirmDelete)
            return;
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
        }
        catch (err) {
            setError(err.message ?? 'No se pudo eliminar el producto');
        }
        finally {
            setSaving(false);
        }
    };
    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setPage('detail');
    };
    return (_jsxs("div", { className: "app", children: [_jsx("header", { className: "header", children: _jsx("h1", { children: "Banco" }) }), _jsxs("main", { className: "container", children: [error && _jsx("div", { className: "error", children: error }), loading && _jsx("div", { className: "loading", children: "Cargando..." }), page === 'list' && (_jsxs("section", { className: "list-page", children: [_jsx("div", { className: "toolbar", children: _jsx("input", { type: "text", placeholder: "Search...", value: search, onChange: (e) => setSearch(e.target.value), className: "search-input" }) }), _jsx("div", { className: "table-wrapper", children: _jsxs("table", { className: "products-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Logo" }), _jsx("th", { children: "Nombre del producto" }), _jsx("th", { children: "Descripci\u00F3n" }), _jsx("th", { children: "Fecha de liberaci\u00F3n" }), _jsx("th", { children: "Fecha de reestructuraci\u00F3n" }), _jsx("th", {})] }) }), _jsx("tbody", { children: filteredProducts.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "empty-cell", children: "No hay productos para mostrar" }) })) : (filteredProducts.map((product) => (_jsxs("tr", { onClick: () => handleSelectProduct(product), children: [_jsx("td", { children: _jsx("img", { className: "table-logo", src: product.logo || DEFAULT_LOGO_URL, alt: product.name, onError: (e) => {
                                                                e.target.src = DEFAULT_LOGO_URL;
                                                            } }) }), _jsx("td", { children: product.name }), _jsx("td", { children: product.description }), _jsx("td", { children: product.date_release }), _jsx("td", { children: product.date_revision }), _jsx("td", { children: _jsxs("div", { className: "row-actions", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: "btn btn-secondary", onClick: () => openEdit(product), children: "Editar" }), _jsx("button", { className: "btn btn-danger", onClick: () => setConfirmDelete(product), children: "Eliminar" })] }) })] }, product.id)))) })] }) }), _jsxs("div", { className: "list-footer", children: [_jsxs("p", { className: "counter", children: [filteredProducts.length, " Registros"] }), _jsx("button", { className: "btn btn-primary btn-add-main", onClick: openCreate, children: "Agregar" })] })] })), page === 'detail' && selectedProduct && (_jsx("section", { className: "detail-page", children: _jsxs("div", { className: "form-card", children: [_jsx("h2", { children: selectedProduct.name }), _jsx("div", { className: "detail-logo-wrapper", children: _jsx("img", { className: "detail-logo", src: selectedProduct.logo || DEFAULT_LOGO_URL, alt: selectedProduct.name, onError: (e) => {
                                            e.target.src = DEFAULT_LOGO_URL;
                                        } }) }), _jsxs("p", { children: [_jsx("strong", { children: "ID:" }), " ", selectedProduct.id] }), _jsxs("p", { children: [_jsx("strong", { children: "Descripci\u00F3n:" }), " ", selectedProduct.description] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de liberaci\u00F3n:" }), " ", selectedProduct.date_release] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de revisi\u00F3n:" }), " ", selectedProduct.date_revision] }), _jsxs("div", { className: "form-actions", children: [_jsx("button", { className: "btn btn-secondary", onClick: () => setPage('list'), children: "Volver" }), _jsx("button", { className: "btn btn-primary", onClick: () => openEdit(selectedProduct), children: "Editar" })] })] }) })), (page === 'create' || page === 'edit') && (_jsx("section", { className: "form-page", children: _jsxs("div", { className: "form-card", children: [_jsx("h2", { children: "Formulario de Registro" }), _jsxs("div", { className: "form-grid", children: [_jsxs("label", { children: ["ID", _jsx("input", { value: form.id, disabled: page === 'edit', onChange: (e) => setForm((prev) => ({ ...prev, id: e.target.value })), className: formErrors.id ? 'input-error' : '' }), formErrors.id && _jsx("span", { className: "field-error", children: formErrors.id })] }), _jsxs("label", { children: ["Nombre", _jsx("input", { value: form.name, onChange: (e) => setForm((prev) => ({ ...prev, name: e.target.value })), className: formErrors.name ? 'input-error' : '' }), formErrors.name && _jsx("span", { className: "field-error", children: formErrors.name })] }), _jsxs("label", { children: ["Descripci\u00F3n", _jsx("input", { value: form.description, onChange: (e) => setForm((prev) => ({ ...prev, description: e.target.value })), className: formErrors.description ? 'input-error' : '' }), formErrors.description && _jsx("span", { className: "field-error", children: formErrors.description })] }), _jsxs("label", { children: ["Logo", _jsx("input", { value: form.logo, onChange: (e) => setForm((prev) => ({ ...prev, logo: e.target.value })), className: formErrors.logo ? 'input-error' : '' }), formErrors.logo && _jsx("span", { className: "field-error", children: formErrors.logo })] }), _jsxs("label", { children: ["Fecha Liberaci\u00F3n", _jsx("input", { type: "date", value: form.date_release, onChange: (e) => setForm((prev) => ({ ...prev, date_release: e.target.value })), className: formErrors.date_release ? 'input-error' : '' }), formErrors.date_release && _jsx("span", { className: "field-error", children: formErrors.date_release })] }), _jsxs("label", { children: ["Fecha Revisi\u00F3n", _jsx("input", { type: "date", value: form.date_revision, disabled: true, className: formErrors.date_revision ? 'input-error' : '' }), formErrors.date_revision && _jsx("span", { className: "field-error", children: formErrors.date_revision })] })] }), _jsxs("div", { className: "form-actions", children: [_jsx("button", { className: "btn btn-secondary", onClick: () => setPage('list'), children: "Cancelar" }), _jsx("button", { className: "btn btn-warning", onClick: resetForm, children: "Reiniciar" }), _jsx("button", { className: "btn btn-primary", disabled: saving, onClick: () => handleSave(page), children: saving ? 'Guardando...' : page === 'create' ? 'Agregar' : 'Guardar Cambios' })] })] }) }))] }), confirmDelete && (_jsx("div", { className: "modal-overlay", onClick: () => setConfirmDelete(null), children: _jsxs("div", { className: "modal-card", onClick: (e) => e.stopPropagation(), children: [_jsxs("p", { children: ["\u00BFEst\u00E1s seguro de eliminar el producto ", confirmDelete.name, "?"] }), _jsxs("div", { className: "form-actions", children: [_jsx("button", { className: "btn btn-secondary", onClick: () => setConfirmDelete(null), children: "Cancelar" }), _jsx("button", { className: "btn btn-danger", disabled: saving, onClick: handleDelete, children: saving ? 'Eliminando...' : 'Eliminar' })] })] }) }))] }));
}
export default App;
