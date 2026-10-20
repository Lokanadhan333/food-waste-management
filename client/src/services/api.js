/**
 * Reusable API service for the FoodShare backend.
 * Every form and page uses these functions instead of calling fetch directly.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** Small helper around fetch that always returns JSON (or throws an Error). */
async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  } catch {
    throw new Error(
      'Could not reach the server. Make sure the backend is running on ' + API_URL
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    // Prefer the detailed validation messages from the server.
    const message =
      (data && (data.details ? data.details.join(' ') : data.error)) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

/** GET /api/health */
export function checkServerHealth() {
  return request('/api/health');
}

/** GET /api/donations - list every donation (optionally filtered server-side). */
export function getDonations() {
  return request('/api/donations');
}

/** GET /api/donations/:id - a single donation. */
export function getDonation(id) {
  return request(`/api/donations/${id}`);
}

/** POST /api/donations - create a new food donation. */
export function createDonation(donation) {
  return request('/api/donations', {
    method: 'POST',
    body: JSON.stringify(donation),
  });
}

/** POST /api/donations/:id/request - ask to collect a donation. */
export function requestDonation(id, requestData) {
  return request(`/api/donations/${id}/request`, {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

/** DELETE /api/donations/:id - only the donor (with the delete token) may delete. */
export function deleteDonation(id, deleteToken) {
  return request(`/api/donations/${id}`, {
    method: 'DELETE',
    headers: { 'X-Delete-Token': deleteToken },
  });
}

/** POST /api/contact - send a contact form message. */
export function sendContactMessage(contact) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(contact),
  });
}

export { API_URL };
