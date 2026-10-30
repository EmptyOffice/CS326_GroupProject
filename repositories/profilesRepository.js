import mongoose from 'mongoose';
import { Profile } from '../models/Profile.js';

export const getAll = async () => {
  return Profile.find().sort({ createdAt: 1 }).lean();
};

export const findById = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Profile.findById(id).lean();
};

export const create = async (data) => {
  const profile = await Profile.create(data);
  return profile.toObject();
};

export const updateById = async (id, data) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Profile.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
};

export const removeById = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Profile.findByIdAndDelete(id).lean();
};
