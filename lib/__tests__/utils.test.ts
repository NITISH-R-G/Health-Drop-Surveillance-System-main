import { filterByRegion } from '../utils';

describe('filterByRegion', () => {
  const items = [
    { id: 1, regionId: 'region-1', name: 'Item 1' },
    { id: 2, regionId: 'region-2', name: 'Item 2' },
    { id: 3, regionId: 'region-1', name: 'Item 3' },
    { id: 4, name: 'Item 4' },
  ];

  it('should return all items if regionId is "all"', () => {
    const result = filterByRegion(items, 'all');
    expect(result).toEqual(items);
  });

  it('should filter items by a specific regionId', () => {
    const result = filterByRegion(items, 'region-1');
    expect(result).toEqual([
      { id: 1, regionId: 'region-1', name: 'Item 1' },
      { id: 3, regionId: 'region-1', name: 'Item 3' },
    ]);
  });

  it('should return an empty array if no items match the regionId', () => {
    const result = filterByRegion(items, 'region-3');
    expect(result).toEqual([]);
  });

  it('should return an empty array if the input items array is empty', () => {
    const result = filterByRegion([], 'region-1');
    expect(result).toEqual([]);
  });

  it('should return all items if regionId is null', () => {
    const result = filterByRegion(items, null);
    expect(result).toEqual(items);
  });

  it('should return all items if regionId is undefined', () => {
    const result = filterByRegion(items, undefined);
    expect(result).toEqual(items);
  });

  it('should return all items if regionId is an empty string', () => {
    const result = filterByRegion(items, '');
    expect(result).toEqual(items);
  });
});
