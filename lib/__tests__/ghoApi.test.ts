import { fetchCholeraCases, fetchCholeraDeaths } from '../ghoApi';
import { Platform } from 'react-native';

const GHO_API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:3000/api/who' : 'https://ghoapi.azureedge.net/api';

describe('ghoApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCholeraCases', () => {
    it('should fetch cholera cases without arguments successfully', async () => {
      const mockData = { value: [{ Id: 1, Value: '100' }] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCholeraCases();

      expect(global.fetch).toHaveBeenCalledWith(`${GHO_API_BASE_URL}?$filter=IndicatorCode eq 'CHOLERA_0000000001'`);
      expect(result).toEqual(mockData);
    });

    it('should fetch cholera cases with countryCode successfully', async () => {
      const mockData = { value: [{ Id: 2, Value: '200' }] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCholeraCases('IND');

      expect(global.fetch).toHaveBeenCalledWith(`${GHO_API_BASE_URL}?$filter=IndicatorCode eq 'CHOLERA_0000000001' and SpatialDim eq 'IND'`);
      expect(result).toEqual(mockData);
    });

    it('should fetch cholera cases with year successfully', async () => {
      const mockData = { value: [{ Id: 2, Value: '200' }] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCholeraCases(undefined, '2023');

      expect(global.fetch).toHaveBeenCalledWith(`${GHO_API_BASE_URL}?$filter=IndicatorCode eq 'CHOLERA_0000000001' and TimeDim eq '2023'`);
      expect(result).toEqual(mockData);
    });

    it('should fetch cholera cases with countryCode and year successfully', async () => {
      const mockData = { value: [{ Id: 2, Value: '200' }] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCholeraCases('IND', '2023');

      expect(global.fetch).toHaveBeenCalledWith(`${GHO_API_BASE_URL}?$filter=IndicatorCode eq 'CHOLERA_0000000001' and SpatialDim eq 'IND' and TimeDim eq '2023'`);
      expect(result).toEqual(mockData);
    });

    it('should handle non-200 HTTP responses gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchCholeraCases();

      expect(result).toEqual({ '@odata.context': '', value: [] });
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network exceptions gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchCholeraCases();

      expect(result).toEqual({ '@odata.context': '', value: [] });
      expect(console.error).toHaveBeenCalledWith('Failed to fetch cholera cases:', expect.any(Error));
    });
  });

  describe('fetchCholeraDeaths', () => {
    it('should fetch cholera deaths without arguments successfully', async () => {
      const mockData = { value: [{ Id: 1, Value: '10' }] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCholeraDeaths();

      expect(global.fetch).toHaveBeenCalledWith(`${GHO_API_BASE_URL}?$filter=IndicatorCode eq 'CHOLERA_0000000002'`);
      expect(result).toEqual(mockData);
    });

    it('should fetch cholera deaths with countryCode successfully', async () => {
      const mockData = { value: [{ Id: 2, Value: '20' }] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCholeraDeaths('IND');

      expect(global.fetch).toHaveBeenCalledWith(`${GHO_API_BASE_URL}?$filter=IndicatorCode eq 'CHOLERA_0000000002' and SpatialDim eq 'IND'`);
      expect(result).toEqual(mockData);
    });

    it('should handle non-200 HTTP responses gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await fetchCholeraDeaths();

      expect(result).toEqual({ '@odata.context': '', value: [] });
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network exceptions gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchCholeraDeaths();

      expect(result).toEqual({ '@odata.context': '', value: [] });
      expect(console.error).toHaveBeenCalledWith('Failed to fetch cholera deaths:', expect.any(Error));
    });
  });
});
