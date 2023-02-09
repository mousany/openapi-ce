import { Context } from '@oneapi/core';
import axios from 'axios';
import process from 'process';
import { Cookie } from 'tough-cookie';

describe('POST /user/login', () => {
  it('should return a cookie symbolizing success', async () => {
    const res = await axios.post(`user/login`, {
      username: process.env['ONEAPI_USERNAME'],
      password: process.env['ONEAPI_PASSWORD'],
    });
    // console.log(res);

    expect(res.status).toBe(200);
    expect(
      res.headers['set-cookie']
        .map((cookie: string) => Cookie.parse(cookie))
        .some(
          (cookie: Cookie) =>
            cookie.key === 'CASTGC' || cookie.key === 'happyVoyagePersonal'
        )
    ).toEqual(true);
  });
});

describe('GET /user/logout', () => {
  it('should return a cookie symbolizing success', async () => {
    const preflight = await axios.post(`user/login`, {
      username: process.env['ONEAPI_USERNAME'],
      password: process.env['ONEAPI_PASSWORD'],
    });

    const context = new Context({
      url: process.env['ONEAPI_LOGIN_URL'],
      cookie: preflight.headers['set-cookie'].map((cookie: string) =>
        Cookie.parse(cookie)
      ),
    });

    const res = await context.get(`user/logout`);

    // console.log(res.headers['set-cookie']);

    expect(res.status).toBe(200);
    expect(
      res.headers['set-cookie']
        .map((cookie: string) => Cookie.parse(cookie))
        .every(
          (cookie: Cookie) =>
            (cookie.key !== 'CASTGC' && cookie.key !== 'happyVoyagePersonal') ||
            ((cookie.key === 'CASTGC' ||
              cookie.key === 'happyVoyagePersonal') &&
              cookie.value === '')
        )
    ).toEqual(true);
  });
});
