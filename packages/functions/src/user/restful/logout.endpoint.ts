import { Request, Response } from 'express';
import { Endpoint, RequestType } from 'firebase-backend';
import process from 'process';
import { Client, Context } from '@oneapi/core';
import { Cookie } from 'tough-cookie';

export default new Endpoint(
  'logout',
  RequestType.POST,
  async (req: Request, res: Response) => {
    const cookie = req.cookies;

    const context = new Context({
      url: req.baseUrl,
      cookie: (() => {
        const result = [];
        for (const key in cookie) {
          const value = cookie[key];
          result.push(`${key}=${value}`);
        }
        return result;
      })().map((cookie) => Cookie.parse(cookie)),
    });

    const client = new Client('', '', context);
    await client.logout(process.env['ONEAPI_LOGOUT_URL']);

    res.status(200);
    res.clearCookie('CASTGC');
    res.clearCookie('happyVoyagePersonal');
  }
);
