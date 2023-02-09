import { AxiosRequestConfig } from 'axios';
import { Cookie } from 'tough-cookie';
import { netManager } from './net';

/**
 * Session stores the cookie of the last request.
 * @interface Session
 * @property url - The url of the last request.
 * @property cookie - The cookie of the last request.
 */
export interface Session {
  url: string;
  cookie: Cookie[] | undefined;
}

/**
 * Convert cookie to string that can be used in the header.
 * @param cookie - The cookie to be converted.
 * @returns The string of cookie.
 */
export function getCookieString(cookie?: Cookie[]): string {
  return cookie?.map((cookie) => cookie.toString()).join('; ') || '';
}

/**
 * Context stores the session of the last request.
 * @class Context
 * @property session - The session of the last request.
 * @method get - Send a GET request.
 * @method post - Send a POST request.
 * @method cookie - Get the cookie of the last request.
 */
export class Context {
  private session?: Session;

  constructor(session?: Session) {
    this.session = session;
  }

  public async get(url: string, options?: AxiosRequestConfig) {
    const cookieString = getCookieString(this.session?.cookie);
    const response = await netManager.get(url, {
      ...options,
      headers: {
        ...options?.headers,
        Cookie: cookieString,
      },
    });

    this.session = {
      url: url,
      cookie: response.headers['set-cookie']?.map(
        (cookie) => Cookie.parse(cookie) as Cookie
      ),
    };

    return response;
  }

  public async post(url: string, data?: unknown, options?: AxiosRequestConfig) {
    const cookieString = getCookieString(this.session?.cookie);
    const response = await netManager.post(url, data, {
      ...options,
      headers: {
        ...options?.headers,
        Cookie: cookieString,
      },
    });

    this.session = {
      url: url,
      cookie: response.headers['set-cookie']?.map(
        (cookie) => Cookie.parse(cookie) as Cookie
      ),
    };

    return response;
  }

  public cookie(): Cookie[] | undefined {
    return this.session?.cookie;
  }
}
