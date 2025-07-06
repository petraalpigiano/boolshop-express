function notFoundHandler(req, res, next) {
  res.status(202).json([]);
}

export default notFoundHandler;
