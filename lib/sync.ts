import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as mockData from './mockData';

const SYNC_KEY_PREFIX = '@healthdrop_sync_';

/**
 * Save data locally to AsyncStorage.
 */
export const saveLocalData = async (key: string, data: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(`${SYNC_KEY_PREFIX}${key}`, jsonValue);
  } catch (e) {
    console.error(`Failed to save local data for key ${key}:`, e);
  }
};

/**
 * Retrieve data from AsyncStorage.
 */
export const getLocalData = async (key: string): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${SYNC_KEY_PREFIX}${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Failed to get local data for key ${key}:`, e);
    return null;
  }
};

/**
 * Sync data from the mock "remote" API to the local store.
 */
export const syncData = async (): Promise<void> => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Save all mock data to the local store
    await saveLocalData('regions', mockData.regions);
    await saveLocalData('outbreaks', mockData.outbreaks);
    await saveLocalData('waterQualityAlerts', mockData.waterQualityAlerts);
    await saveLocalData('dashboardStats', mockData.dashboardStats);
    await saveLocalData('trendData', mockData.trendData);
    await saveLocalData('predictionInsights', mockData.predictionInsights);

    console.log('Data synchronization complete.');
  } catch (error) {
    console.error('Data synchronization failed:', error);
  }
};

/**
 * A hook to use data that prioritizes local storage and syncs in the background.
 */
export function useSyncData<T>(key: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Try local storage first
      const localData = await getLocalData(key);
      if (localData) {
        setData(localData);
      } else {
        // If no local data, we fallback to initial (which could be the mock data itself)
        // and trigger a sync to populate local storage.
        setData(initialData);
      }
      setLoading(false);
    };

    loadData();
  }, [key]);

  return { data, loading, setData };
}
