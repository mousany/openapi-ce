import axios from 'axios';
import { Request, Response } from 'express';
import { Endpoint, RequestType } from 'firebase-backend';
import process from 'process';
import { Cookie } from 'tough-cookie';

export default new Endpoint(
  'forward',
  RequestType.POST,
  async (req: Request, res: Response) => {
    const response = await axios.post(
      process.env['ONEAPI_LOGIN_URL'],
      req.body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...req.headers,
        },
        maxRedirects: 0,
        validateStatus: (status) => status === 302,
        withCredentials: true,
      }
    );

    res.contentType(response.headers['content-type']);

    const cookies = response.headers['set-cookie']?.map((cookie) =>
      Cookie.parse(cookie)
    );

    if (cookies) {
      for (const cookie of cookies) {
        res.cookie(cookie.key, cookie.value, {
          signed: cookie.secure,
          path: cookie.path,
          maxAge: cookie.maxAge as number,
        });
      }
    }

    res.status(200);
    res.send(response.data);
  }
);
