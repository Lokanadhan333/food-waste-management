import { useCallback, useEffect, useState } from 'react';
import { getDonations, requestDonation, deleteDonation } from '../services/api.js';
import DonationCard from '../components/DonationCard.jsx';
import Spinner from '../components/Spinner.jsx';
import Message from '../components/Message.jsx';

export default function FindFood() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Request form state
  const [selected, setSelected] = useState(null);
  const [requestForm, setRequestForm] = useState({ requesterName: '', requesterPhone: '', message: '' });
  const [requestBusy, setRequestBusy] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, message, contact? }

  const loadDonations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDonations();
      setDonations(data.donations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const filtered = donations.filter((donation) => {
    const text = `${donation.foodName} ${donation.description} ${donation.pickupLocation} ${donation.donorName}`.toLowerCase();
    const matchesSearch = text.includes(search.trim().toLowerCase());
    const matchesCategory = category === 'all' || donation.category === category;
    return matchesSearch && matchesCategory;
  });

  function openRequestForm(donation) {
    setSelected(donation);
    setFeedback(null);
    setRequestForm({ requesterName: '', requesterPhone: '', message: '' });
  }

  async function handleRequest(event) {
    event.preventDefault();
    if (!selected) return;

    const errors = [];
    if (!requestForm.requesterName.trim()) errors.push('Please enter your name.');
    if (!/^[0-9+\-\s()]{7,20}$/.test(requestForm.requesterPhone.trim()))
      errors.push('Please enter a valid contact number.');
    if (errors.length > 0) {
      setFeedback({ type: 'error', message: errors.join(' ') });
      return;
    }

    setRequestBusy(true);
    setFeedback(null);
    try {
      const data = await requestDonation(selected._id, requestForm);
      setFeedback({
        type: 'success',
        message: data.message,
        contact: data.pickupContact,
      });
      setSelected(null);
      await loadDonations();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setRequestBusy(false);
    }
  }

  async function handleDelete(donation) {
    const token = localStorage.getItem(`foodshare_token_${donation._id}`);
    if (!token) {
      setFeedback({
        type: 'error',
        message: 'Only the donor who created this listing (with the private delete token saved in their browser) can delete it.',
      });
      return;
    }
    if (!window.confirm(`Delete the donation "${donation.foodName}"?`)) return;

    try {
      await deleteDonation(donation._id, token);
      localStorage.removeItem(`foodshare_token_${donation._id}`);
      setFeedback({ type: 'success', message: 'Donation deleted.' });
      await loadDonations();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  }

  return (
    <div className="page container">
      <h1 className="page-title">Find Food</h1>
      <p className="page-subtitle">
        Browse surplus food available near you. Request what you need — the donor will share the
        pickup contact.
      </p>

      <div className="filters card">
        <div className="field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by food, donor, or location…"
          />
        </div>
        <div className="field">
          <label htmlFor="categoryFilter">Category</label>
          <select
            id="categoryFilter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="filters-bar">
        <span className="result-count">
          {filtered.length} donation{filtered.length === 1 ? '' : 's'} found
        </span>
        <button type="button" className="btn btn-ghost" onClick={loadDonations}>
          ↻ Refresh
        </button>
      </div>

      {feedback && <Message type={feedback.type}>{feedback.message}</Message>}
      {feedback && feedback.contact && (
        <Message type="success">
          <strong>Pickup contact:</strong> <a href={`tel:${feedback.contact}`}>{feedback.contact}</a>
        </Message>
      )}

      {selected && (
        <div className="card request-card">
          <h2>Request “{selected.foodName}”</h2>
          <p>
            {selected.quantity} {selected.unit} · {selected.pickupLocation}
          </p>
          <form onSubmit={handleRequest} className="form" noValidate>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="requesterName">Your name *</label>
                <input
                  id="requesterName"
                  type="text"
                  value={requestForm.requesterName}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, requesterName: e.target.value }))
                  }
                  placeholder="e.g. Hope Shelter"
                  maxLength={80}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="requesterPhone">Your contact number *</label>
                <input
                  id="requesterPhone"
                  type="tel"
                  value={requestForm.requesterPhone}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, requesterPhone: e.target.value }))
                  }
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>
              <div className="field field-full">
                <label htmlFor="requestMessage">Message (optional)</label>
                <textarea
                  id="requestMessage"
                  rows={2}
                  value={requestForm.message}
                  onChange={(e) =>
                    setRequestForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="e.g. We can collect around 7 PM today."
                  maxLength={500}
                />
              </div>
            </div>
            <div className="card-actions">
              <button type="submit" className="btn btn-primary" disabled={requestBusy}>
                {requestBusy ? 'Sending…' : 'Send Request'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSelected(null)}
                disabled={requestBusy}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <Spinner label="Loading donations…" />
      ) : error ? (
        <Message type="error">
          Could not load donations: {error}
        </Message>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-icon" aria-hidden="true">🍲</span>
          <h3>No food available right now</h3>
          <p>
            {donations.length === 0
              ? 'There are no donations in the database yet. Be the first to share food!'
              : 'No donations match your search or filter. Try different keywords.'}
          </p>
        </div>
      ) : (
        <div className="donations-grid">
          {filtered.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              onRequest={openRequestForm}
              onDelete={handleDelete}
              busy={requestBusy}
            />
          ))}
        </div>
      )}
    </div>
  );
}
