export const filterByRegion = <T extends { regionId?: string }>(
  items: T[],
  regionId: string | null | undefined
): T[] => {
  if (!regionId || regionId === 'all') {
    return items;
  }
  return items.filter(item => item.regionId === regionId);
};
