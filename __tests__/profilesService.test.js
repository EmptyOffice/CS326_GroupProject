import { jest } from '@jest/globals';

jest.unstable_mockModule('../repositories/profilesRepository.js', () => ({
  getAll: jest.fn(),
  save: jest.fn((data) => ({ _id: 'fake-id', ...data })),
}));

const { createProfile, listProfiles } = await import('../services/profilesService.js');
const { getAll } = await import('../repositories/entriesRepository.js');

// to check for from validateProfiles:

// age must be 14+

// yearsPlayed must be a valid number (0+)

// USTA rating must be between 1.0 and 7.0

// USTA ranking must be a positive number if provided (0+)

// name, age, yearsPlayed and availability are required fields

test('createProfile rejects a missing name', async () => {
  const result = await createProfile({ name: '', age: '20', yearsPlayed: '3', availability: 'Weekdays' });
  expect(result.ok).toBe(false);
});

// ({ name, age, yearsPlayed, ustaRating, ustaRanking, availability })

test('createProfile saves a valid profile and returns it', async () => {
  const result = await createProfile({ name: 'D', age: '22', yearsPlayed: '1', availability: 'Sunday Mornings' });
  expect(result.ok).toBe(true);
  expect(result.value).toEqual({ id: 'fake-id', name: 'D', age: '22', yearsPlayed: '1', availability: 'Sunday Mornings' });
});

test('listProfiles returns profiles sorted alphabetically by name', async () => {
  getAll.mockResolvedValueOnce([
    { _id: '1', name: 'C', age: '19', yearsPlayed: '4', availability: 'Weekdays' },
    { _id: '2', name: 'B', age: '20', yearsPlayed: '5', availability: 'Weekends' },
    { _id: '3', name: 'A', age: '21', yearsPlayed: '3', availability: 'Weekday Afternoons' },
  ]);
  const result = await listProfiles();
  expect(result.map((profile) => profile.name)).toEqual(['A', 'B', 'C']);
});
