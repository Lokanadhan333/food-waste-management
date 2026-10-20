/**
 * Simple accessible alert used for success / error / info messages.
 * `type` can be: success | error | info
 */
export default function Message({ type = 'info', children }) {
  if (!children) return null;
  return (
    <div className={`message message-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
