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

  describe('Error handling', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('saveLocalData should catch and log errors', async () => {
      const testError = new Error('AsyncStorage error');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(testError);

      await saveLocalData('testKey', { foo: 'bar' });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save local data for key testKey:',
        testError
      );
    });

    it('getLocalData should catch errors, log them, and return null', async () => {
      const testError = new Error('AsyncStorage error');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(testError);

      const result = await getLocalData('testKey');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to get local data for key testKey:',
        testError
      );
      expect(result).toBeNull();
    });

    it('syncData should catch and log errors', async () => {
      const testError = new Error('AsyncStorage error');

      // We need to mock saveLocalData here since syncData calls it, but
      // saveLocalData catches the AsyncStorage error itself.
      // To test syncData's catch block, we need to make something in its
      // try block throw that isn't caught. The simplest way is to mock
      // the setTimeout or one of the saveLocalData calls.

      // Let's mock a global fetch or just mock the function it calls.
      // Since it's exported from the same module, we might have to spy on it.
      // However, we can also just mock the Promise to throw for the timeout.

      // Override setTimeout to throw an error just for this test
      const originalSetTimeout = global.setTimeout;
      try {
        (global as any).setTimeout = jest.fn().mockImplementation(() => {
          throw testError;
        });

        await syncData();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Data synchronization failed:',
          testError
        );
      } finally {
        // Restore setTimeout
        global.setTimeout = originalSetTimeout;
      }
    });
  });
});
