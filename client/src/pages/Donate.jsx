import { useState } from 'react';
import { createDonation } from '../services/api.js';
import Message from '../components/Message.jsx';

const initialForm = {
  donorName: '',
  foodName: '',
  description: '',
  quantity: '',
  unit: 'plates',
  category: 'vegetarian',
  preparedAt: '',
  expiresAt: '',
  pickupLocation: '',
  contactNumber: '',
};

/** Client-side validation - the server validates again. */
function validate(form) {
  const errors = [];

  if (!form.donorName.trim()) errors.push('Please enter your name.');
  if (!/^[0-9+\-\s()]{7,20}$/.test(form.contactNumber.trim()))
    errors.push('Please enter a valid contact number.');
  if (!form.foodName.trim()) errors.push('Please enter the food name.');
  if (!form.description.trim()) errors.push('Please add a short description.');
  if (!form.quantity.trim() || Number(form.quantity) <= 0)
    errors.push('Please enter a valid quantity.');
  if (!form.preparedAt) errors.push('Please choose the preparation date and time.');
  if (!form.expiresAt) errors.push('Please choose the safe-consumption deadline.');
  if (form.preparedAt && form.expiresAt && new Date(form.expiresAt) <= new Date(form.preparedAt))
    errors.push('The deadline must be later than the preparation time.');
  if (form.expiresAt && new Date(form.expiresAt) <= new Date())
    errors.push('The deadline must be in the future — expired food cannot be donated.');
  if (!form.pickupLocation.trim()) errors.push('Please enter the pickup location.');

  return errors;
}

export default function Donate() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    setSuccess(null);

    const clientErrors = validate(form);
    setErrors(clientErrors);
    if (clientErrors.length > 0) return;

    setSubmitting(true);
    try {
      const data = await createDonation(form);

      // Remember the delete token in this browser only, so the donor
      // (and nobody else) can remove the donation later.
      if (data.deleteToken) {
        localStorage.setItem(`foodshare_token_${data.donation._id}`, data.deleteToken);
      }

      setSuccess({
        message: data.message,
        token: data.deleteToken,
      });
      setForm(initialForm);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page container narrow">
      <h1 className="page-title">Donate Food</h1>
      <p className="page-subtitle">
        Have surplus food from a party, restaurant, or kitchen? List it here and someone nearby
        will pick it up before it goes to waste.
      </p>

      {errors.length > 0 && (
        <Message type="error">
          <strong>Please fix the following:</strong>
          <ul className="message-list">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </Message>
      )}

      {serverError && <Message type="error">{serverError}</Message>}

      {success && (
        <Message type="success">
          <p>{success.message}</p>
          <p className="token-note">
            Your private delete token: <code>{success.token}</code> (saved in this browser only —
            do not share it publicly).
          </p>
        </Message>
      )}

      <form className="form card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="donorName">Donor name *</label>
            <input
              id="donorName"
              name="donorName"
              type="text"
              value={form.donorName}
              onChange={handleChange}
              placeholder="e.g. Green Leaf Restaurant"
              maxLength={80}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="contactNumber">Contact number *</label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="foodName">Food name *</label>
            <input
              id="foodName"
              name="foodName"
              type="text"
              value={form.foodName}
              onChange={handleChange}
              placeholder="e.g. Vegetable biryani"
              maxLength={120}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="category">Food category *</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="quantity">Quantity *</label>
            <input
              id="quantity"
              name="quantity"
              type="text"
              inputMode="numeric"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="unit">Unit *</label>
            <select id="unit" name="unit" value={form.unit} onChange={handleChange}>
              <option value="plates">Plates</option>
              <option value="packets">Packets</option>
              <option value="boxes">Boxes</option>
              <option value="kg">Kilograms</option>
              <option value="litres">Litres</option>
            </select>
          </div>

          <div className="field field-full">
            <label htmlFor="description">Food description *</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the food, packaging, and any handling notes"
              maxLength={1000}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="preparedAt">Prepared date &amp; time *</label>
            <input
              id="preparedAt"
              name="preparedAt"
              type="datetime-local"
              value={form.preparedAt}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="expiresAt">Safe-consumption deadline *</label>
            <input
              id="expiresAt"
              name="expiresAt"
              type="datetime-local"
              value={form.expiresAt}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field field-full">
            <label htmlFor="pickupLocation">Pickup location *</label>
            <input
              id="pickupLocation"
              name="pickupLocation"
              type="text"
              value={form.pickupLocation}
              onChange={handleChange}
              placeholder="e.g. 12 MG Road, near City Library, Bengaluru"
              maxLength={200}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Donation'}
        </button>
      </form>
    </div>
  );
}
