import { listProfiles, createProfile, removeProfile } from '../services/profilesService.js';

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
  const result = await removeProfile(req.params.id);
  
  if (!result.ok) {
    console.error("Delete error:", result.error);
    return res.status(500).send('<div class="text-red-500">Failed to delete</div>');
  }
  
  res.send(''); 
};