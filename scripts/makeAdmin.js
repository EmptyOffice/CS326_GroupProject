import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import { updateRole } from '../repositories/usersRepository.js';

const email = process.argv[2];

if (!email) {
  console.log('Usage: npm run make-admin -- someone@email.com');
  process.exit(1);
}

await connectDB();

const user = await updateRole(email, 'admin');

if (!user) {
  console.log(`No user found with email ${email}, sign up first`);
} else {
  console.log(`${user.email} is now an admin`);
}

await mongoose.disconnect();
