import { Request, Response } from 'express';
import { Endpoint, RequestType } from 'firebase-backend';
import process from 'process';
import { Client } from '@oneapi/core';

export default new Endpoint(
  'login',
  RequestType.POST,
  async (req: Request, res: Response) => {
    const username: string = req.body['username'];
    const password: string = req.body['password'];

    const client = new Client(username, password);
    const cookies = await client.login(process.env['ONEAPI_LOGIN_URL']);

    const tokenString = cookies.map((cookie) => cookie.toString()).join('; ');
    res.status(200).send(tokenString);
  }
);
