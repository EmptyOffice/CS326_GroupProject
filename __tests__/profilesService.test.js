import { jest } from '@jest/globals';

jest.unstable_mockModule('../repositories/profilesRepository.js', () => ({
  getAll: jest.fn(),
  save: jest.fn((data) => ({ _id: 'fake-id', ...data })),
}));

const { createProfile, listProfiles } = await import('../services/profilesService.js');
const { getAll } = await import('../repositories/entriesRepository.js');

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
