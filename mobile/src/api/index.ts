const BASE = 'http://localhost:3002';

export const getProducts = async () => {
  try {
    const res = await fetch(`${BASE}/products`);
    const json = await res.json();
    // expected { success: true, data: [...] }
    return json?.data ?? [];
  } catch (err) {
    console.warn('getProducts error', err);
    return [];
  }
};

export const fetchExample = async () => {
  return { ok: true };
};
