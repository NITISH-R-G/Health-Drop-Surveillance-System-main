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
    await Promise.all([
      saveLocalData('regions', mockData.regions),
      saveLocalData('outbreaks', mockData.outbreaks),
      saveLocalData('waterQualityAlerts', mockData.waterQualityAlerts),
      saveLocalData('dashboardStats', mockData.dashboardStats),
      saveLocalData('diseaseTrendData', mockData.diseaseTrendData),
      saveLocalData('waterQualityTrendData', mockData.waterQualityTrendData),
      saveLocalData('predictionInsights', mockData.predictionInsights),
      saveLocalData('preventionCampaigns', mockData.preventionCampaigns),
      saveLocalData('alerts', mockData.alerts),
      saveLocalData('leaderboardData', mockData.leaderboardData),
    ]);

    console.log('Data synchronization complete.');
  } catch (error) {
    console.error('Data synchronization failed:', error);
  }
};

/**
 * A hook to use data that prioritizes local storage and syncs in the background.
 */
export function useSyncData<K extends keyof typeof mockData>(key: K) {
  // Use the type and value from mockData for initialization and fallback
  const initialData = mockData[key];
  const [data, setData] = useState<typeof initialData>(initialData);
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
  }, [key, initialData]);

  return { data, loading, setData };
}
