import { Ok, Err } from '../result.js';
import { getAll, save } from '../repositories/profilesRepository.js';

const validateProfile = ({ name, age, yearsPlayed, ustaRating, ustaRanking, availability }) => {
  if (!name || !age || !yearsPlayed || !availability) {
    return Err({ status: 400, message: 'Name, age, years played, and availability are required' });
  }

  const parsedAge = parseInt(age, 10);
  if (Number.isNaN(parsedAge) || parsedAge < 14) {
    return Err({ status: 400, message: 'Age must be a valid number (14+)' });
  }

  const parsedYears = parseInt(yearsPlayed, 10);
  if (Number.isNaN(parsedYears) || parsedYears < 0) {
    return Err({ status: 400, message: 'Years played must be a valid number (0+)' });
  }

  let parsedRating = null;
  if (ustaRating) {
    parsedRating = parseFloat(ustaRating);
    if (Number.isNaN(parsedRating) || parsedRating < 1.0 || parsedRating > 7.0) {
      return Err({ status: 400, message: 'USTA rating must be between 1.0 and 7.0' });
    }
  }

  let parsedRanking = null;
  if (ustaRanking) {
    parsedRanking = parseInt(ustaRanking, 10);
    if (Number.isNaN(parsedRanking) || parsedRanking < 1) {
      return Err({ status: 400, message: 'USTA ranking must be a positive number if provided' });
    }
  }

  return Ok({ 
    name: name.trim(), 
    age: parsedAge, 
    yearsPlayed: parsedYears,
    ustaRating: parsedRating, 
    ustaRanking: parsedRanking, 
    availability: availability.trim() 
  });
};

export const createProfile = async (data) => {
  const result = validateProfile(data);
  if (!result.ok) return result;

  const profiles = await getAll();
  const maxId = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) : 0;
  
  const newProfile = {
    id: maxId + 1,
    ...result.value
  };

  profiles.push(newProfile);
  await save(profiles);
  
  return Ok(newProfile);
};

export const listProfiles = async (filters) => {
  let profiles = await getAll(); 

  if (filters.name) {
    const searchString = filters.name.toLowerCase();
    profiles = profiles.filter(p => p.name.toLowerCase().includes(searchString));
  }

  if (filters.ustaRating) {
    const targetRating = parseFloat(filters.ustaRating);
    profiles = profiles.filter(p => p.ustaRating === targetRating);
  }

  if (filters.ustaRanking) {
    const maxRanking = parseInt(filters.ustaRanking, 10);
    profiles = profiles.filter(p => p.ustaRanking > 0 && p.ustaRanking <= maxRanking);
  }

  return Ok(profiles); 
};