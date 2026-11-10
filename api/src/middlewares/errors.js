// No route matched the request
export const notFound = (req, res) => {
  res.status(404).json({ error: 'Not found' });
};

// Any error thrown in a route ends up here; details stay in the server log
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
};
