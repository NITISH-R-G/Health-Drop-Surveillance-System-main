import { saveLocalData, getLocalData, syncData } from '../sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as mockData from '../mockData';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('Sync Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save data to AsyncStorage', async () => {
    const testData = { foo: 'bar' };
    await saveLocalData('testKey', testData);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@healthdrop_sync_testKey',
      JSON.stringify(testData)
    );
  });

  it('should retrieve data from AsyncStorage', async () => {
    const testData = { foo: 'bar' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(testData));

    const result = await getLocalData('testKey');

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@healthdrop_sync_testKey');
    expect(result).toEqual(testData);
  });

  it('should return null if data is not found in AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const result = await getLocalData('testKey');

    expect(result).toBeNull();
  });

  it('should sync data from mockData', async () => {
    await syncData();

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(9);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@healthdrop_sync_regions',
      JSON.stringify(mockData.regions)
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@healthdrop_sync_outbreaks',
      JSON.stringify(mockData.outbreaks)
    );
    // ... we can assume the rest are called if these two are.
  });
});
