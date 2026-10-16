import { listProfiles, createProfile } from '../services/profilesService.js';

export const index = async (req, res) => {
  const result = await listProfiles(req.query);
  
  if (!result.ok) {
    return res.status(400).json({ error: result.error.message });
  }
  
  res.json(result.value);
};

export const create = async (req, res) => {
  const result = await createProfile(req.body);
  
  if (!result.ok) {
    return res.status(result.error.status || 400).json({ error: result.error.message });
  }
  
  res.status(201).json(result.value);
};