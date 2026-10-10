// Thin wrapper around fetch: attaches the JWT, parses JSON, throws readable errors.
async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('ksk_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error('Could not reach the server. Check that the backend is running.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch (parseErr) {
    // no JSON body
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('ksk_token');
      localStorage.removeItem('ksk_user');
    }
    throw new Error((data && data.message) || 'Something went wrong. Please try again.');
  }

  return data;
}

const api = {
  get: (path, opts = {}) => apiRequest(path, { method: 'GET', ...opts }),
  post: (path, body, opts = {}) => apiRequest(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts = {}) => apiRequest(path, { method: 'PUT', body, ...opts }),
  del: (path, opts = {}) => apiRequest(path, { method: 'DELETE', ...opts }),
};
