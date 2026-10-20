import { useState } from 'react';
import { sendContactMessage } from '../services/api.js';
import Message from '../components/Message.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess('');
    setServerError('');

    const localErrors = [];
    if (!form.name.trim()) localErrors.push('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      localErrors.push('Please enter a valid email address.');
    if (!form.message.trim()) localErrors.push('Please write a message.');

    setErrors(localErrors);
    if (localErrors.length > 0) return;

    setSubmitting(true);
    try {
      const data = await sendContactMessage(form);
      setSuccess(data.message);
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page container narrow">
      <h1 className="page-title">Contact Us</h1>
      <p className="page-subtitle">
        Questions, feedback, or want to partner with FoodShare in your city? Send us a message.
      </p>

      {errors.length > 0 && (
        <Message type="error">
          <ul className="message-list">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </Message>
      )}
      {serverError && <Message type="error">{serverError}</Message>}
      {success && <Message type="success">{success}</Message>}

      <form className="form card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Your name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Asha Sharma"
            maxLength={80}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            maxLength={120}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="How can we help?"
            maxLength={2000}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>

      <div className="card contact-info">
        <h2>Other ways to reach us</h2>
        <ul className="about-list">
          <li>📧 Email: hello@foodshare.example</li>
          <li>📍 Office: FoodShare Community Centre, MG Road, Bengaluru</li>
          <li>🕐 Support hours: Monday–Saturday, 9 AM – 6 PM</li>
        </ul>
      </div>
    </div>
  );
}
