import bcrypt from 'bcrypt';
import { Ok, Err } from '../result.js';
import { findByEmail, create } from '../repositories/usersRepository.js';
import { toUserDto } from '../dtos/userDto.js';

const SALT_ROUNDS = 10;

export const signup = async ({ email, password }) => {
  if (!email || !password) {
    return Err({ status: 400, message: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail.includes('@')) {
    return Err({ status: 400, message: 'Email must be a valid email address' });
  }

  if (password.length < 8) {
    return Err({ status: 400, message: 'Password must be at least 8 characters' });
  }

  const existing = await findByEmail(cleanEmail);
  if (existing) {
    return Err({ status: 409, message: 'An account with that email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await create({ email: cleanEmail, passwordHash, role: 'member' });
    return Ok(toUserDto(user));
  } catch (error) {
    if (error.code === 11000) {
      return Err({ status: 409, message: 'An account with that email already exists' });
    }
    throw error;
  }
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    return Err({ status: 400, message: 'Email and password are required' });
  }

  const user = await findByEmail(email.trim());
  if (!user) {
    return Err({ status: 401, message: 'Wrong email or password' });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return Err({ status: 401, message: 'Wrong email or password' });
  }

  return Ok(toUserDto(user));
};
