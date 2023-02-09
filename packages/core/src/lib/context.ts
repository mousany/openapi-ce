import { AxiosRequestConfig } from 'axios';
import { Cookie } from 'tough-cookie';
import { netManager } from './net';

export interface Session {
  url: string;
  cookie: Cookie[] | undefined;
}

export function getCookieString(cookie?: Cookie[]): string {
  return cookie?.map((cookie) => cookie.toString()).join('; ') || '';
}

export class Context {
  private session?: Session;

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
