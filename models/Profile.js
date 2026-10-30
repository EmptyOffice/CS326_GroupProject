import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 14 },
  yearsPlayed: { type: Number, required: true, min: 0 },
  availability: { type: String, required: true, trim: true },
  ustaRating: { type: Number, min: 1, max: 7, default: null },
  ustaRanking: { type: Number, min: 1, default: null }
}, { timestamps: true });

export const Profile = mongoose.model('Profile', profileSchema);
