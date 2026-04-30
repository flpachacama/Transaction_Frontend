const BASE = 'http://localhost:3002';

const handleResponse = async (res: Response) => {
  const json = await res.json();
  if (!res.ok) {
    const error = new Error(json?.error?.message || `HTTP ${res.status}`);
    (error as any).status = res.status;
    (error as any).data = json;
    throw error;
  }
  return json;
};

export const getProducts = async () => {
  try {
    const res = await fetch(`${BASE}/products`);
    const json = await handleResponse(res);
    return json?.data ?? [];
  } catch (err) {
    console.warn('getProducts error', err);
    throw err;
  }
};

export const fetchExample = async () => {
  return { ok: true };
};

export const checkProductExists = async (id: string) => {
  try {
    const res = await fetch(`${BASE}/products/${encodeURIComponent(id)}/verify`);
    const json = await handleResponse(res);
    return !!json?.data?.exists;
  } catch (err) {
    console.warn('checkProductExists error', err);
    return false;
  }
};

export const createProduct = async (payload: any) => {
  try {
    const res = await fetch(`${BASE}/products`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    const json = await handleResponse(res);
    return json;
  } catch (err) {
    console.warn('createProduct error', err);
    throw err;
  }
};

export const updateProduct = async (id: string, payload: any) => {
  try {
    const res = await fetch(`${BASE}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    const json = await handleResponse(res);
    return json;
  } catch (err) {
    console.warn('updateProduct error', err);
    throw err;
  }
};

