export const filterByRegion = <T extends { regionId?: string }>(
  data: T[],
  regionId: string
): T[] => {
  if (regionId === 'all') return data;
  return data.filter((item) => item.regionId === regionId);
};
