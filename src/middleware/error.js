export function notFound(_req, res, _next) {
  return res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, _req, res, _next) {
    if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'ValidationError', details: err.errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal Server Error' });
}
