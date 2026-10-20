const CATEGORY_LABELS = {
  vegetarian: 'Vegetarian',
  'non-vegetarian': 'Non-Vegetarian',
  other: 'Other',
};

const STATUS_LABELS = {
  available: 'Available',
  requested: 'Requested',
  collected: 'Collected',
  expired: 'Expired',
};

function formatDeadline(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

export default function DonationCard({ donation, onRequest, onDelete, busy }) {
  const isExpired = new Date(donation.expiresAt) < new Date();
  const unavailable = isExpired || donation.status !== 'available';

  return (
    <article className={`card donation-card ${unavailable ? 'card-muted' : ''}`}>
      <div className="card-top">
        <h3 className="card-title">{donation.foodName}</h3>
        <span className={`badge badge-${donation.category}`}>
          {CATEGORY_LABELS[donation.category] || donation.category}
        </span>
      </div>

      <p className="card-desc">{donation.description}</p>

      <ul className="card-details">
        <li>
          <span className="detail-label">Quantity</span>
          <span className="detail-value">
            {donation.quantity} {donation.unit}
          </span>
        </li>
        <li>
          <span className="detail-label">Pickup location</span>
          <span className="detail-value">{donation.pickupLocation}</span>
        </li>
        <li>
          <span className="detail-label">Safe until</span>
          <span className="detail-value">{formatDeadline(donation.expiresAt)}</span>
        </li>
        <li>
          <span className="detail-label">Donor</span>
          <span className="detail-value">{donation.donorName}</span>
        </li>
        <li>
          <span className="detail-label">Status</span>
          <span className={`detail-value status-${isExpired ? 'expired' : donation.status}`}>
            {isExpired ? STATUS_LABELS.expired : STATUS_LABELS[donation.status] || donation.status}
          </span>
        </li>
      </ul>

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onRequest(donation)}
          disabled={unavailable || busy}
        >
          {busy ? 'Sending…' : unavailable ? 'Unavailable' : 'Request Food'}
        </button>
        {onDelete && (
          <button type="button" className="btn btn-ghost" onClick={() => onDelete(donation)} disabled={busy}>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
