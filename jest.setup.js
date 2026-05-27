require('cross-fetch/polyfill');
// Define missing properties to avoid Expo error
if (typeof global.Request === 'undefined') {
  global.Request = require('cross-fetch').Request;
}
if (typeof global.Response === 'undefined') {
  global.Response = require('cross-fetch').Response;
}
if (typeof global.Headers === 'undefined') {
  global.Headers = require('cross-fetch').Headers;
}

jest.mock('expo-modules-core', () => {
  return {
    requireNativeModule: () => ({
      NativeResponse: class NativeResponse {}
    }),
    requireNativeViewManager: () => () => null
  };
});
