/** 404 handler for unknown API routes. */
export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

/** Central error handler - never leaks stack traces to the client. */
export function errorHandler(err, req, res, next) {
  console.error('[server error]', err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong on the server. Please try again.'
        : err.message || 'Something went wrong on the server.',
  });
}
