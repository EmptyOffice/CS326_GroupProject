import mongoose from 'mongoose';
import { User } from '../models/User.js';

export const findByEmail = async (email) => {
  return User.findOne({ email: email.toLowerCase() }).lean();
};

export const findById = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return User.findById(id).lean();
};

export const create = async (data) => {
  const user = await User.create(data);
  return user.toObject();
};

export const updateRole = async (email, role) => {
  return User.findOneAndUpdate({ email: email.toLowerCase() }, { role }, { returnDocument: 'after', runValidators: true }).lean();
};
