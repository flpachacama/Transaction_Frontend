import React, { useState, useEffect, useRef } from 'react';
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

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const timerRef = useRef<number | null>(null);

  // Fetch products
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const items = data.data || [];
        setProducts(items);
        setFilteredProducts(items);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Search debounce
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (!q) {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(q)));
      }
    }, 400);
  }, [query, products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setPage('detail');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setPage('edit');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Transaction Management</h1>
      </header>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {page === 'list' && (
        <div className="list-page">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="counter">
            Total: {filteredProducts.length} of {products.length}
          </div>

          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <p>No products found</p>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="product-card" onClick={() => handleSelectProduct(product)}>
                  <div className="product-logo">
                    <img src={product.logo} alt={product.name} onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                    }} />
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description.substring(0, 77)}...</p>
                </div>
              ))
            )}
          </div>

          <button className="btn btn-primary" onClick={() => setPage('create')}>
            New Product
          </button>
        </div>
      )}

      {page === 'detail' && selectedProduct && (
        <div className="detail-page">
          <button className="btn btn-secondary" onClick={() => setPage('list')}>← Back</button>
          <h2>{selectedProduct.name}</h2>
          <div className="detail-info">
            <p><strong>ID:</strong> {selectedProduct.id}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Logo:</strong> <a href={selectedProduct.logo} target="_blank">{selectedProduct.logo}</a></p>
            <p><strong>Release Date:</strong> {selectedProduct.date_release}</p>
            <p><strong>Revision Date:</strong> {selectedProduct.date_revision}</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleEdit(selectedProduct)}>
            Edit
          </button>
        </div>
      )}

      {page === 'create' && (
        <div className="form-page">
          <button className="btn btn-secondary" onClick={() => setPage('list')}>← Back</button>
          <h2>Create Product</h2>
          <p style={{ color: '#666' }}>Form coming soon...</p>
        </div>
      )}

      {page === 'edit' && selectedProduct && (
        <div className="form-page">
          <button className="btn btn-secondary" onClick={() => setPage('list')}>← Back</button>
          <h2>Edit: {selectedProduct.name}</h2>
          <p style={{ color: '#666' }}>Form coming soon...</p>
        </div>
      )}
    </div>
  );
}

export default App;
