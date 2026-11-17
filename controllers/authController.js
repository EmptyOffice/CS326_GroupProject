import { signup, login } from '../services/authService.js';

const startSession = (req, user) => {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.user = user;
      resolve();
    });
  });
};

export const signupUser = async (req, res) => {
  const result = await signup(req.body);

  if (!result.ok) {
    return res.status(result.error.status || 400).json({ error: result.error.message });
  }

  await startSession(req, result.value);
  res.status(201).json(result.value);
};

export const loginUser = async (req, res) => {
  const result = await login(req.body);

  if (!result.ok) {
    return res.status(result.error.status || 400).json({ error: result.error.message });
  }

  await startSession(req, result.value);
  res.json(result.value);
};

export const logoutUser = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
};

export const currentUser = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
};
