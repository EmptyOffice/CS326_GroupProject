export const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    if (req.get('HX-Request') === 'true') {
      res.status(401).send('You must be logged in to do that.');
      return;
    }
    res.status(401).json({ error: 'You must be logged in to do that.' });
    return;
  }
  next();
};
