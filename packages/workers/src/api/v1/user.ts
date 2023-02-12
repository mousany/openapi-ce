import { Router } from 'itty-router';
import axios from 'axios';
import { Client } from '@oneapi/core';

export const userRouter = Router({
  base: '/api/v1/user',
});

userRouter.post('/login', async (request) => {
  const { username, password } = await request.json();
  const client = new Client(username, password);
  const cookies = await client.login(ONEAPI_LOGIN_URL);

  const tokenString = cookies.map((cookie) => cookie.toString()).join('; ');

  return new Response(tokenString, {
    status: 200,
    headers: {},
  });
});

userRouter.get('/logout', async () => {
  return new Response('Hello world!');
});

userRouter.post('/forward', async (request, env) => {
  return axios.post(env.ONEAPI_LOGIN_URL, request.body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...request.headers,
    },
    maxRedirects: 0,
    validateStatus: (status) => status === 302,
  });
});
