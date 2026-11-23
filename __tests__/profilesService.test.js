import { jest } from '@jest/globals';

jest.unstable_mockModule('../repositories/profilesRepository.js', () => ({
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ id: 'fake-id', ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));

jest.unstable_mockModule('../repositories/usersRepository.js', () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

const { createProfile, listProfiles, removeProfile } = await import('../services/profilesService.js');
const { getAll, removeById } = await import('../repositories/profilesRepository.js');
const profilesRepository = await import('../repositories/profilesRepository.js');
const usersRepository = await import('../repositories/usersRepository.js');

const mockUser1 = { id: 'mock1-id' };
const mockUser2 = { id: 'mock2-id' };
const admin = { id: 'admin-id' };

beforeEach(() => {
  jest.resetAllMocks();
  profilesRepository.create.mockImplementation((data) => ({ id: 'fake-id', ...data }));
});

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
  const result = await createProfile({ name: 'D', age: '22', yearsPlayed: '1', availability: 'Sunday Mornings' }, mockUser1);
  expect(result.ok).toBe(true);
  expect(result.value).toEqual({ id: 'fake-id', name: 'D', ownerId: 'mock1-id', age: 22, yearsPlayed: 1, ustaRanking: null, ustaRating: null, availability: 'Sunday Mornings' });
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
  profilesRepository.findById.mockResolvedValueOnce({ _id: 'fake-id', ownerId: { toString: () => 'mock1-id' }});
  removeById.mockResolvedValueOnce({ _id: 'fake-id' });
  const result = await removeProfile('fake-id', mockUser1);
  expect(result.ok).toBe(true);
  expect(removeById).toHaveBeenCalledWith('fake-id');
});

test('removeProfile throws an error when deletion fails', async () => {
  profilesRepository.findById.mockResolvedValueOnce({ _id: 'fake-id', ownerId: { toString: () => 'mock1-id' }});

  removeById.mockRejectedValueOnce(new Error('Failed to delete from database'));
  const result = await removeProfile('fake-id', mockUser1);
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(500);
  expect(result.error.message).toBe('Failed to delete from database');
});

test('removeProfile successfully deletes a profile when attempted by an admin', async () => {
  profilesRepository.findById.mockResolvedValueOnce({ _id: 'a1', ownerId: { toString: () => 'mock1-id' }});
  usersRepository.findById.mockResolvedValueOnce({ _id: 'admin-id', role: 'admin' });
  removeById.mockResolvedValueOnce( { _id: 'a1' });
  const result = await removeProfile('a1', admin);
  expect(result.ok).toBe(true);
  expect(usersRepository.findById).toHaveBeenCalledWith('admin-id');
});

test('removeProfile successfully deletes a profile when attempted by an owner', async () => {
  profilesRepository.findById.mockResolvedValueOnce({ _id: 'b1', ownerId: { toString: () => 'mock1-id' }});
  const result = await removeProfile('b1', mockUser1);
  expect(result.ok).toBe(true);
});

test('removeProfile throws a 403 error when deletion is attempted by a non-owner and non-admin', async () => {
  profilesRepository.findById.mockResolvedValueOnce({ _id: 'c1', ownerId: { toString: () => 'mock1-id' }});
  usersRepository.findById.mockResolvedValueOnce({ _id: 'mock2-id', role: 'member' });

  const result = await removeProfile('c1', mockUser2);
  expect(usersRepository.findById).toHaveBeenCalledWith('mock2-id');
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(403);
});
