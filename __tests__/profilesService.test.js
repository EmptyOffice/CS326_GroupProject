import { jest } from '@jest/globals';

jest.unstable_mockModule('../repositories/profilesRepository.js', () => ({
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ id: 'fake-id', ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));

const { createProfile, listProfiles, removeProfile } = await import('../services/profilesService.js');
const { getAll, removeById } = await import('../repositories/profilesRepository.js');

test('createProfile rejects a missing name field', async () => {
  const result = await createProfile({ name: '', age: '20', yearsPlayed: '3', availability: 'Weekdays' });
  expect(result.ok).toBe(false);
});

test('createProfile rejects a missing age field', async () => {
  const result = await createProfile({ name: 'A', age: '', yearsPlayed: '3', availability: 'Weekdays' });
  expect(result.ok).toBe(false);
});

test('createProfile rejects a missing yearsPlayed field', async () => {
  const result = await createProfile({ name: 'A', age: '20', yearsPlayed: '', availability: 'Weekdays' });
  expect(result.ok).toBe(false);
});

test('createProfile rejects a missing availability field', async () => {
  const result = await createProfile({ name: 'A', age: '20', yearsPlayed: '3', availability: '' });
  expect(result.ok).toBe(false);
});

test('createProfile rejects an age value below 14', async () => {
  const result = await createProfile({ name: 'A', age: '10', yearsPlayed: '1', availability: 'Weekdays' });
  expect(result.ok).toBe(false);
});

test('createProfile rejects a yearsPlayed value below 0', async () => {
  const result = await createProfile({ name: 'A', age: '20', yearsPlayed: '-5', availability: 'Weekdays' });
  expect(result.ok).toBe(false);
});

test('createProfile rejects a ustaRating value below 1.0', async () => {
  const result = await createProfile({ name: 'B', age: '24', yearsPlayed: '4', ustaRating: '-3', availability: 'Weekends' });
  expect(result.ok).toBe(false);
});

test('createProfile rejects a ustaRating value above 7.0', async () => {
  const result = await createProfile({ name: 'C', age: '23', yearsPlayed: '3', ustaRating: '20', availability: 'Weekdays' });
  expect(result.ok).toBe(false);
});

test('createProfile rejects a ustaRanking value below 0', async () => {
  const result = await createProfile({ name: 'E', age: '25', yearsPlayed: '7', ustaRanking: '-30', availability: 'Weekends' });
  expect(result.ok).toBe(false);
});

test('createProfile saves a valid profile and returns it', async () => {
  const result = await createProfile({ name: 'D', age: '22', yearsPlayed: '1', availability: 'Sunday Mornings' });
  expect(result.ok).toBe(true);
  expect(result.value).toEqual({ id: 'fake-id', name: 'D', age: 22, yearsPlayed: 1, ustaRanking: null, ustaRating: null, availability: 'Sunday Mornings' });
});

test('listProfiles returns profiles sorted alphabetically by name', async () => {
  getAll.mockResolvedValueOnce([
    { _id: '1', name: 'C', age: '19', yearsPlayed: '4', availability: 'Weekdays' },
    { _id: '2', name: 'B', age: '20', yearsPlayed: '5', availability: 'Weekends' },
    { _id: '3', name: 'A', age: '21', yearsPlayed: '3', availability: 'Weekday Afternoons' },
  ]);
  const result = await listProfiles();
  expect(result.value.map((profile) => profile.name)).toEqual(['A', 'B', 'C']);
});

test('removeProfile successfully deletes a given profile', async () => {
  const profile = { id: 'fake-id' };
  removeById.mockResolvedValueOnce(profile);
  const result = await removeProfile(profile.id);
  expect(result.ok).toBe(true);
});

test('removeProfile throws an error when deletion fails', async () => {
  removeById.mockRejectedValueOnce(new Error('Failed to delete from database'));
  const result = await removeProfile('fake-id');
  expect(result.ok).toBe(false);
  expect(result.error.message).toBe('Failed to delete from database');
});
