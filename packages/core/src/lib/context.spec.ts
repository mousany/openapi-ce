import { getCookieString } from './context';

describe('getCookieString', () => {
  it('should return empty string when session is undefined', () => {
    expect(getCookieString(undefined)).toBe('');
  });
});
