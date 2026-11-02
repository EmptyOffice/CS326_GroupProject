import { listProfiles, createProfile } from '../services/profilesService.js';
import { Profile } from '../models/Profile.js'; 
export const index = async (req, res) => {
  const result = await listProfiles(req.query);
  
  if (!result.ok) {
    return res.status(400).send(`<div class="text-red-500">${result.error.message}</div>`);
  }
  
  res.render('partials/profile-list', { profiles: result.value });
};

export const create = async (req, res) => {
  const result = await createProfile(req.body);
  
  if (!result.ok) {
    return res.status(result.error.status || 400).json({ error: result.error.message });
  }
  
  res.status(201).json(result.value);
};

export const deleteProfile = async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.send(''); 
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).send('<div class="text-red-500">Failed to delete</div>');
  }
};