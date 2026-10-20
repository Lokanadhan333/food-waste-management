export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <span>{label}</span>
    </div>
  );
}
