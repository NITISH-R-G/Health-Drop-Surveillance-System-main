import { saveLocalData, getLocalData, syncData, useSyncData } from '../sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as mockData from '../mockData';
import { renderHook, waitFor } from '@testing-library/react-native';

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

  it('should handle errors when saving data to AsyncStorage', async () => {
    const testData = { foo: 'bar' };
    const mockError = new Error('AsyncStorage error');
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(mockError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await saveLocalData('testKey', testData);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to save local data for key testKey:', mockError);
    consoleSpy.mockRestore();
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

  it('should handle errors when retrieving data from AsyncStorage', async () => {
    const mockError = new Error('AsyncStorage error');
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(mockError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await getLocalData('testKey');

    expect(consoleSpy).toHaveBeenCalledWith('Failed to get local data for key testKey:', mockError);
    expect(result).toBeNull();
    consoleSpy.mockRestore();
  });

  it('should sync data from mockData', async () => {
    // Suppress console.log for this successful test
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
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

    consoleSpy.mockRestore();
  });

  it('should handle errors during syncData execution', async () => {
    // Force a rejection inside syncData's try block to test its catch block
    // We can do this by temporarily overriding global Promise or similar, but
    // since syncData awaits Promise.all on saveLocalData, and saveLocalData
    // catches its own errors without throwing, syncData's catch block is only
    // triggered if something else fails (like the Promise.all itself or a timeout).
    // Let's mock Promise.all temporarily.
    const originalPromiseAll = Promise.all.bind(Promise);
    const mockError = new Error('Sync completely failed');
    jest.spyOn(Promise, 'all').mockRejectedValueOnce(mockError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await syncData();

    expect(consoleSpy).toHaveBeenCalledWith('Data synchronization failed:', mockError);

    consoleSpy.mockRestore();
    // Restore original Promise.all
    jest.restoreAllMocks();
  });

  describe('useSyncData hook', () => {
    it('should load data from local storage if available', async () => {
      const mockLocalData = [{ id: 'mock1', name: 'Mock Region' }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockLocalData));

      const { result } = renderHook(() => useSyncData('regions'));

      expect(result.current.loading).toBe(true);
      // Wait for useEffect to finish
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@healthdrop_sync_regions');
      expect(result.current.data).toEqual(mockLocalData);
    });

    it('should fallback to mockData if local storage is empty', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const { result } = renderHook(() => useSyncData('regions'));

      expect(result.current.loading).toBe(true);
      // Wait for useEffect to finish
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@healthdrop_sync_regions');
      expect(result.current.data).toEqual(mockData.regions);
    });
  });
});
